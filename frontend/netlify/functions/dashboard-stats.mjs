const { requireAuth } = require('./_shared/auth')
const { getDb, initSchema } = require('./_shared/db')
const { success, unauthorized, error, optionsResponse } = require('./_shared/response')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return optionsResponse()
  if (!requireAuth(event)) return unauthorized()

  try {
    await initSchema()
    const db = getDb()

    const clients = await db.execute('SELECT * FROM clients ORDER BY created_at DESC')
    const projects = await db.execute('SELECT * FROM client_projects ORDER BY created_at DESC')
    const codes = await db.execute('SELECT * FROM referral_codes ORDER BY created_at DESC')
    const uses = await db.execute('SELECT * FROM referral_uses ORDER BY used_at DESC')
    const discounts = await db.execute('SELECT * FROM discount_ledger ORDER BY created_at DESC')

    const currentYear = new Date().getFullYear()
    const activeCodes = codes.rows.filter(c => c.status === 'active' && c.year === currentYear)
    const usedCodes = codes.rows.filter(c => c.status === 'used')
    const thisMonth = new Date().toISOString().slice(0, 7)
    const refsThisMonth = uses.rows.filter(u => u.used_at && u.used_at.startsWith(thisMonth))

    return success({
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
    return error(500, err.message)
  }
}
