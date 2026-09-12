const { requireAuth } = require('./_shared/auth')
const { getDb, initSchema } = require('./_shared/db')
const { success, unauthorized, badRequest, error, optionsResponse } = require('./_shared/response')
const crypto = require('crypto')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return optionsResponse()
  if (!requireAuth(event)) return unauthorized()

  try {
    await initSchema()
    const db = getDb()

    if (event.httpMethod === 'GET') {
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

      return success({ clients: clientsWithMeta })
    }

    if (event.httpMethod === 'POST') {
      const { name, logo, phone, email, website, relation_since, description } = JSON.parse(event.body || '{}')
      if (!name) return badRequest('name required')

      const id = crypto.randomUUID()
      await db.execute({
        sql: 'INSERT INTO clients (id, name, logo, phone, email, website, relation_since, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        args: [id, name, logo || null, phone || null, email || null, website || null, relation_since || null, description || null],
      })
      return success({ id, message: 'Client created' })
    }

    if (event.httpMethod === 'PUT') {
      const { id, name, logo, phone, email, website, relation_since, description } = JSON.parse(event.body || '{}')
      if (!id) return badRequest('id required')
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
      return success({ message: 'Client updated' })
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id
      if (!id) return badRequest('id required')

      const projects = await db.execute({ sql: 'SELECT id FROM client_projects WHERE client_id = ?', args: [id] })
      for (const p of projects.rows) {
        await db.execute({ sql: 'DELETE FROM referral_uses WHERE referee_project_id = ?', args: [p.id] })
        await db.execute({ sql: 'DELETE FROM discount_ledger WHERE project_id = ?', args: [p.id] })
        await db.execute({ sql: 'DELETE FROM referral_codes WHERE project_id = ?', args: [p.id] })
      }
      await db.execute({ sql: 'DELETE FROM client_projects WHERE client_id = ?', args: [id] })
      await db.execute({ sql: 'DELETE FROM clients WHERE id = ?', args: [id] })
      return success({ message: 'Client deleted' })
    }

    return badRequest('Method not allowed')
  } catch (err) {
    return error(500, err.message)
  }
}
