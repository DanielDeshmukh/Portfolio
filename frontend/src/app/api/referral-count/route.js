import { NextResponse } from 'next/server'
import { getDb, initSchema } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    await initSchema()
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const clientName = searchParams.get('client_name')

    if (!clientName) {
      return NextResponse.json({ ok: false, error: 'client_name required' }, { status: 400 })
    }

    const result = await db.execute({
      sql: `SELECT cp.name as project_name, COUNT(rc.id) as total, 
            SUM(CASE WHEN rc.status = 'active' THEN 1 ELSE 0 END) as active
            FROM client_projects cp
            JOIN clients cl ON cp.client_id = cl.id
            LEFT JOIN referral_codes rc ON rc.project_id = cp.id
            WHERE cl.name = ?
            GROUP BY cp.id, cp.name`,
      args: [clientName],
    })

    return NextResponse.json({ ok: true, projects: result.rows })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message, projects: [] }, { status: 500 })
  }
}
