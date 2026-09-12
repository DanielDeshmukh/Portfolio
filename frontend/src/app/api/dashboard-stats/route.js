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

    const clients = await db.execute('SELECT * FROM clients ORDER BY created_at DESC')
    const projects = await db.execute('SELECT * FROM client_projects ORDER BY created_at DESC')
    const codes = await db.execute('SELECT * FROM referral_codes ORDER BY created_at DESC')
    const uses = await db.execute('SELECT * FROM referral_uses ORDER BY used_at DESC')
    const discounts = await db.execute('SELECT * FROM discount_ledger')

    const currentYear = new Date().getFullYear()
    const activeCodes = codes.rows.filter(c => c.status === 'active' && c.year === currentYear)
    const usedCodes = codes.rows.filter(c => c.status === 'used')
    const thisMonth = new Date().toISOString().slice(0, 7)
    const refsThisMonth = uses.rows.filter(u => u.used_at && u.used_at.startsWith(thisMonth))

    return NextResponse.json({
      ok: true,
      stats: {
        totalClients: clients.rows.length,
        totalProjects: projects.rows.length,
        totalCodes: codes.rows.length,
        activeCodes: activeCodes.length,
        usedCodes: usedCodes.length,
        totalReferrals: uses.rows.length,
        referralsThisMonth: refsThisMonth.length,
        totalDiscounts: discounts.rows.length,
        pendingDiscounts: discounts.rows.filter(d => d.status === 'pending').length,
      },
      recentReferrals: uses.rows.slice(0, 10),
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
