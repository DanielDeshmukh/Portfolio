import { NextResponse } from 'next/server'
import { getDb, initSchema } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    await initSchema()
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ ok: false, error: 'code required' }, { status: 400 })
    }

    const result = await db.execute({
      sql: `SELECT rc.*, cp.name as project_name, cl.name as client_name, cl.logo as client_logo
            FROM referral_codes rc
            JOIN client_projects cp ON rc.project_id = cp.id
            JOIN clients cl ON cp.client_id = cl.id
            WHERE rc.code = ?`,
      args: [code],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Invalid referral code' }, { status: 404 })
    }

    const row = result.rows[0]

    if (row.status === 'used') {
      const use = await db.execute({
        sql: 'SELECT * FROM referral_uses WHERE code_id = ?',
        args: [row.id],
      })
      return NextResponse.json({
        ok: true,
        code: row.code,
        project: row.project_name,
        client: row.client_name,
        logo: row.client_logo,
        status: 'used',
        usedAt: use.rows[0]?.used_at || null,
      })
    }

    await db.execute({
      sql: 'INSERT INTO referral_clicks (code, project_id) VALUES (?, ?)',
      args: [row.code, row.project_id],
    })

    return NextResponse.json({
      ok: true,
      code: row.code,
      project: row.project_name,
      client: row.client_name,
      logo: row.client_logo,
      status: 'active',
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
