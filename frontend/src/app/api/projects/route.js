import { NextResponse } from 'next/server'
import { requireAuth } from '../../../lib/auth'
import { getDb, initSchema } from '../../../lib/db'
import crypto from 'crypto'

export async function GET(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')

    let query = 'SELECT * FROM client_projects'
    let params = []
    if (clientId) {
      query += ' WHERE client_id = ?'
      params.push(clientId)
    }
    query += ' ORDER BY created_at DESC'
    const result = await db.execute({ sql: query, args: params })
    return NextResponse.json({ ok: true, projects: result.rows })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()
    const { client_id, name, github, live } = await request.json()

    if (!client_id || !name) {
      return NextResponse.json({ ok: false, error: 'client_id and name required' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    await db.execute({
      sql: 'INSERT INTO client_projects (id, client_id, name, github, live) VALUES (?, ?, ?, ?, ?)',
      args: [id, client_id, name, github || null, live || null],
    })
    return NextResponse.json({ ok: true, id, message: 'Project created' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()
    const { id, name, github, live } = await request.json()

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
    }

    await db.execute({
      sql: 'UPDATE client_projects SET name = COALESCE(?, name), github = COALESCE(?, github), live = COALESCE(?, live) WHERE id = ?',
      args: [name, github, live, id],
    })
    return NextResponse.json({ ok: true, message: 'Project updated' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
    }

    await db.execute({ sql: 'DELETE FROM referral_uses WHERE referee_project_id = ?', args: [id] })
    await db.execute({ sql: 'DELETE FROM discount_ledger WHERE project_id = ?', args: [id] })
    await db.execute({ sql: 'DELETE FROM referral_codes WHERE project_id = ?', args: [id] })
    await db.execute({ sql: 'DELETE FROM client_projects WHERE id = ?', args: [id] })
    return NextResponse.json({ ok: true, message: 'Project deleted' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
