import { NextResponse } from 'next/server'
import { requireAuth } from '../../../lib/auth'
import { getDb, initSchema } from '../../../lib/db'

export async function GET(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()

    const clients = await db.execute('SELECT COUNT(*) as count FROM clients')
    const projects = await db.execute('SELECT COUNT(*) as count FROM client_projects')
    const earnings = await db.execute('SELECT * FROM earnings ORDER BY created_at DESC')
    const codes = await db.execute('SELECT * FROM referral_codes ORDER BY created_at DESC')
    const uses = await db.execute('SELECT * FROM referral_uses ORDER BY used_at DESC')

    const totalEarnings = earnings.rows.reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const paidEarnings = earnings.rows.filter(e => e.status === 'paid').reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const pendingEarnings = earnings.rows.filter(e => e.status === 'pending').reduce((sum, e) => sum + Number(e.amount || 0), 0)

    const dailyEarnings = await db.execute(
      `SELECT date(created_at) as day, SUM(amount) as total
       FROM earnings
       WHERE created_at >= date('now', '-90 days')
       GROUP BY date(created_at)
       ORDER BY day ASC`
    )

    const currentYear = new Date().getFullYear()
    const activeCodes = codes.rows.filter(c => c.status === 'active' && c.year === currentYear)
    const usedCodes = codes.rows.filter(c => c.status === 'used')

    const recentEarnings = earnings.rows.slice(0, 10).map(e => ({
      ...e,
      amount: Number(e.amount || 0),
    }))

    return NextResponse.json({
      ok: true,
      stats: {
        totalClients: clients.rows.length,
        totalProjects: projects.rows.length,
        totalEarnings,
        paidEarnings,
        pendingEarnings,
        totalCodes: codes.rows.length,
        activeCodes: activeCodes.length,
        usedCodes: usedCodes.length,
        totalReferrals: uses.rows.length,
        dailyEarnings: dailyEarnings.rows.map(d => ({ ...d, total: Number(d.total || 0) })),
        recentEarnings,
      },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
