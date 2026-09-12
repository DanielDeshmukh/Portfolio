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

    const result = await db.execute('SELECT * FROM clients ORDER BY created_at DESC')
    const projects = await db.execute('SELECT * FROM client_projects')
    const codes = await db.execute('SELECT * FROM referral_codes')
    const uses = await db.execute('SELECT * FROM referral_uses')

    const clientsWithMeta = result.rows.map(client => {
      const clientProjects = projects.rows.filter(p => p.client_id === client.id)
      const projectIds = clientProjects.map(p => p.id)
      const clientCodes = codes.rows.filter(c => projectIds.includes(c.project_id))
      const clientUses = uses.rows.filter(u => clientCodes.some(c => c.id === u.code_id))

      return {
        ...client,
        project_count: clientProjects.length,
        total_referrals: clientUses.length,
      }
    })

    return NextResponse.json({ ok: true, clients: clientsWithMeta })
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
    const { name, logo, phone, email, website, relation_since, description } = await request.json()

    if (!name) {
      return NextResponse.json({ ok: false, error: 'name required' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    await db.execute({
      sql: 'INSERT INTO clients (id, name, logo, phone, email, website, relation_since, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, name, logo || null, phone || null, email || null, website || null, relation_since || null, description || null],
    })
    return NextResponse.json({ ok: true, id, message: 'Client created' })
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
    const { id, name, logo, phone, email, website, relation_since, description } = await request.json()

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
    }

    await db.execute({
      sql: `UPDATE clients SET
        name = COALESCE(?, name),
        logo = COALESCE(?, logo),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        website = COALESCE(?, website),
        relation_since = COALESCE(?, relation_since),
        description = COALESCE(?, description)
        WHERE id = ?`,
      args: [name, logo, phone, email, website, relation_since, description, id],
    })
    return NextResponse.json({ ok: true, message: 'Client updated' })
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

    const projects = await db.execute({ sql: 'SELECT id FROM client_projects WHERE client_id = ?', args: [id] })
    for (const p of projects.rows) {
      await db.execute({ sql: 'DELETE FROM referral_uses WHERE referee_project_id = ?', args: [p.id] })
      await db.execute({ sql: 'DELETE FROM discount_ledger WHERE project_id = ?', args: [p.id] })
      await db.execute({ sql: 'DELETE FROM referral_codes WHERE project_id = ?', args: [p.id] })
    }
    await db.execute({ sql: 'DELETE FROM client_projects WHERE client_id = ?', args: [id] })
    await db.execute({ sql: 'DELETE FROM clients WHERE id = ?', args: [id] })
    return NextResponse.json({ ok: true, message: 'Client deleted' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
