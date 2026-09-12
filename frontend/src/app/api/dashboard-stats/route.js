import { NextResponse } from 'next/server'
import { requireAuth } from '../../../lib/auth'
import { getDb, initSchema } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()

    const [clientsRes, projectsRes, earningsRes, codesRes, usesRes] = await Promise.all([
      db.execute('SELECT * FROM clients'),
      db.execute('SELECT * FROM client_projects'),
      db.execute('SELECT * FROM earnings ORDER BY created_at DESC'),
      db.execute('SELECT * FROM referral_codes'),
      db.execute('SELECT * FROM referral_uses'),
    ])

    const allEarnings = earningsRes.rows
    const totalEarnings = allEarnings.reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const paidEarnings = allEarnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const pendingEarnings = allEarnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + Number(e.amount || 0), 0)

    const dailyEarnings = await db.execute(
      `SELECT date(created_at) as day, SUM(amount) as total
       FROM earnings
       WHERE created_at >= date('now', '-90 days')
       GROUP BY date(created_at)
       ORDER BY day ASC`
    )

    const currentYear = new Date().getFullYear()
    const activeCodes = codesRes.rows.filter(c => c.status === 'active' && c.year === currentYear)
    const usedCodes = codesRes.rows.filter(c => c.status === 'used')

    const recentEarnings = allEarnings.slice(0, 10).map(e => ({
      ...e,
      amount: Number(e.amount || 0),
    }))

    return NextResponse.json({
      ok: true,
      stats: {
        totalClients: clientsRes.rows.length,
        totalProjects: projectsRes.rows.length,
        totalEarnings,
        paidEarnings,
        pendingEarnings,
        totalCodes: codesRes.rows.length,
        activeCodes: activeCodes.length,
        usedCodes: usedCodes.length,
        totalReferrals: usesRes.rows.length,
        dailyEarnings: dailyEarnings.rows.map(d => ({ ...d, total: Number(d.total || 0) })),
        recentEarnings,
      },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
