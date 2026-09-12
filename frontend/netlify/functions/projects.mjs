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
      const clientId = event.queryStringParameters?.client_id
      let query = 'SELECT * FROM client_projects'
      let params = []
      if (clientId) {
        query += ' WHERE client_id = ?'
        params.push(clientId)
      }
      query += ' ORDER BY created_at DESC'
      const result = await db.execute({ sql: query, args: params })
      return success({ projects: result.rows })
    }

    if (event.httpMethod === 'POST') {
      const { client_id, name, github, live } = JSON.parse(event.body || '{}')
      if (!client_id || !name) return badRequest('client_id and name required')

      const id = crypto.randomUUID()
      await db.execute({
        sql: 'INSERT INTO client_projects (id, client_id, name, github, live) VALUES (?, ?, ?, ?, ?)',
        args: [id, client_id, name, github || null, live || null],
      })
      return success({ id, message: 'Project created' })
    }

    if (event.httpMethod === 'PUT') {
      const { id, name, github, live } = JSON.parse(event.body || '{}')
      if (!id) return badRequest('id required')
      await db.execute({
        sql: 'UPDATE client_projects SET name = COALESCE(?, name), github = COALESCE(?, github), live = COALESCE(?, live) WHERE id = ?',
        args: [name, github, live, id],
      })
      return success({ message: 'Project updated' })
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id
      if (!id) return badRequest('id required')
      await db.execute({ sql: 'DELETE FROM referral_uses WHERE referee_project_id = ?', args: [id] })
      await db.execute({ sql: 'DELETE FROM discount_ledger WHERE project_id = ?', args: [id] })
      await db.execute({ sql: 'DELETE FROM referral_codes WHERE project_id = ?', args: [id] })
      await db.execute({ sql: 'DELETE FROM client_projects WHERE id = ?', args: [id] })
      return success({ message: 'Project deleted' })
    }

    return badRequest('Method not allowed')
  } catch (err) {
    return error(500, err.message)
  }
}
