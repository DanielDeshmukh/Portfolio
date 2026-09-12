import { NextResponse } from 'next/server'
import { getDb, initSchema } from '../../../lib/db'
import crypto from 'crypto'
import clientsData from '../../../../public/data/clients.json'

export async function POST() {
  try {
    await initSchema()
    const db = getDb()

    let clientsInserted = 0
    let projectsInserted = 0

    for (const client of clientsData.clients) {
      const existing = await db.execute({
        sql: 'SELECT id FROM clients WHERE id = ?',
        args: [client.id],
      })

      if (existing.rows.length > 0) continue

      await db.execute({
        sql: 'INSERT INTO clients (id, name, logo, phone, email, website, relation_since, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        args: [
          client.id,
          client.name,
          client.logo || null,
          client.contact?.phone || null,
          client.contact?.email || null,
          client.contact?.website || null,
          client.relationSince || null,
          client.description || null,
        ],
      })
      clientsInserted++

      for (const project of client.projects || []) {
        const projectId = `${client.id}-${crypto.randomUUID().slice(0, 8)}`
        await db.execute({
          sql: 'INSERT INTO client_projects (id, client_id, name, github, live) VALUES (?, ?, ?, ?, ?)',
          args: [projectId, client.id, project.name, project.github || null, project.live || null],
        })
        projectsInserted++
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Seeded',
      clients: clientsInserted,
      projects: projectsInserted,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
