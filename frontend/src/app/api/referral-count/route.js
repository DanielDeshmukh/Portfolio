import { NextResponse } from 'next/server'
import { getDb, initSchema } from '../../../lib/db'

export const dynamic = 'force-dynamic'

const MAX_SLOTS = 3

export async function GET(request) {
  try {
    await initSchema()
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const clientName = searchParams.get('client_name')

    if (!clientName) {
      return NextResponse.json({ ok: false, error: 'client_name required' }, { status: 400 })
    }

    const year = new Date().getFullYear()

    const result = await db.execute({
      sql: `SELECT cp.id, cp.name as project_name,
            COUNT(rc.id) as generated,
            SUM(CASE WHEN rc.status = 'active' THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN rc.status = 'used' THEN 1 ELSE 0 END) as used
            FROM client_projects cp
            JOIN clients cl ON cp.client_id = cl.id
            LEFT JOIN referral_codes rc ON rc.project_id = cp.id AND rc.year = ?
            WHERE cl.name = ?
            GROUP BY cp.id, cp.name`,
      args: [year, clientName],
    })

    const projects = result.rows.map(r => ({
      project_name: r.project_name,
      generated: parseInt(r.generated),
      active: parseInt(r.active),
      used: parseInt(r.used),
      available: MAX_SLOTS - parseInt(r.generated),
    }))

    return NextResponse.json({ ok: true, projects })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message, projects: [] }, { status: 500 })
  }
}
