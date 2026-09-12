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

    const totalResult = await db.execute('SELECT COUNT(*) as count FROM page_views')
    const totalViews = parseInt(totalResult.rows[0].count)

    const today = new Date().toISOString().slice(0, 10)
    const todayResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM page_views WHERE date(viewed_at) = ?",
      args: [today],
    })
    const viewsToday = parseInt(todayResult.rows[0].count)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().slice(0, 10)
    const weekResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM page_views WHERE date(viewed_at) >= ?",
      args: [weekAgoStr],
    })
    const viewsThisWeek = parseInt(weekResult.rows[0].count)

    const byPathResult = await db.execute(
      'SELECT path, COUNT(*) as views FROM page_views GROUP BY path ORDER BY views DESC'
    )

    const referralClicksResult = await db.execute(
      'SELECT code, COUNT(*) as clicks FROM referral_clicks GROUP BY code ORDER BY clicks DESC'
    )

    return NextResponse.json({
      ok: true,
      stats: {
        totalViews,
        viewsToday,
        viewsThisWeek,
        byPath: byPathResult.rows,
        referralClicks: referralClicksResult.rows,
      },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
