import { NextResponse } from 'next/server'
import { getDb, initSchema } from '../../../../lib/db'
import crypto from 'crypto'

export async function POST(request) {
  try {
    await initSchema()
    const db = getDb()
    const { path, referrer } = await request.json()
    const userAgent = request.headers.get('user-agent') || null
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    await db.execute({
      sql: 'INSERT INTO page_views (path, referrer, user_agent, ip_hash) VALUES (?, ?, ?, ?)',
      args: [path || '/', referrer || null, userAgent, ipHash],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
