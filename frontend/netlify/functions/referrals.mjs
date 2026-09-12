const { requireAuth } = require('./_shared/auth')
const { getDb, initSchema } = require('./_shared/db')
const { success, unauthorized, badRequest, error, optionsResponse } = require('./_shared/response')
const crypto = require('crypto')

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'SGP-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return optionsResponse()
  if (!requireAuth(event)) return unauthorized()

  try {
    await initSchema()
    const db = getDb()

    if (event.httpMethod === 'GET') {
      const projectId = event.queryStringParameters?.project_id
      const year = event.queryStringParameters?.year || new Date().getFullYear()

      if (!projectId) return badRequest('project_id required')

      const codes = await db.execute({
        sql: 'SELECT * FROM referral_codes WHERE project_id = ? AND year = ? ORDER BY slot',
        args: [projectId, parseInt(year)],
      })

      const codeIds = codes.rows.map(c => c.id)
      let uses = []
      if (codeIds.length > 0) {
        const placeholders = codeIds.map(() => '?').join(',')
        uses = await db.execute({
          sql: `SELECT ru.*, rc.code, rc.slot FROM referral_uses ru
                JOIN referral_codes rc ON ru.code_id = rc.id
                WHERE rc.project_id = ? AND rc.year = ?
                ORDER BY ru.used_at`,
          args: [projectId, parseInt(year)],
        })
      }

      const discounts = await db.execute({
        sql: 'SELECT * FROM discount_ledger WHERE project_id = ? AND year = ? ORDER BY discount_month',
        args: [projectId, parseInt(year)],
      })

      return success({
        codes: codes.rows,
        uses: uses.rows,
        discounts: discounts.rows,
      })
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const action = body.action

      if (action === 'generate') {
        const { project_id, year } = body
        if (!project_id) return badRequest('project_id required')

        const yr = year || new Date().getFullYear()
        const existing = await db.execute({
          sql: 'SELECT COUNT(*) as count FROM referral_codes WHERE project_id = ? AND year = ?',
          args: [project_id, yr],
        })

        if (existing.rows[0].count >= 3) {
          return badRequest('Already 3 codes exist for this project this year')
        }

        const codes = []
        for (let slot = 1; slot <= 3; slot++) {
          let code
          let attempts = 0
          do {
            code = generateCode()
            attempts++
          } while (attempts < 10)

          const id = crypto.randomUUID()
          await db.execute({
            sql: 'INSERT INTO referral_codes (id, project_id, code, year, slot) VALUES (?, ?, ?, ?, ?)',
            args: [id, project_id, code, yr, slot],
          })
          codes.push({ id, code, slot })
        }

        return success({ codes, message: '3 codes generated' })
      }

      if (action === 'apply') {
        const { code_id, referee_name, referee_phone, referee_project_id } = body
        if (!code_id || !referee_name) return badRequest('code_id and referee_name required')

        const codeRow = await db.execute({
          sql: 'SELECT * FROM referral_codes WHERE id = ? AND status = ?',
          args: [code_id, 'active'],
        })

        if (codeRow.rows.length === 0) return badRequest('Code not found or already used')
        const code = codeRow.rows[0]

        const useId = crypto.randomUUID()
        await db.execute({
          sql: 'INSERT INTO referral_uses (id, code_id, referee_name, referee_phone, referee_project_id) VALUES (?, ?, ?, ?, ?)',
          args: [useId, code_id, referee_name, referee_phone || null, referee_project_id || null],
        })

        await db.execute({
          sql: "UPDATE referral_codes SET status = 'used' WHERE id = ?",
          args: [code_id],
        })

        const allUsed = await db.execute({
          sql: 'SELECT COUNT(*) as count FROM referral_uses WHERE code_id IN (SELECT id FROM referral_codes WHERE project_id = ? AND year = ?)',
          args: [code.project_id, code.year],
        })

        const count = parseInt(allUsed.rows[0].count)
        const firstUse = await db.execute({
          sql: 'SELECT ru.used_at FROM referral_uses ru JOIN referral_codes rc ON ru.code_id = rc.id WHERE rc.project_id = ? AND rc.year = ? ORDER BY ru.used_at ASC LIMIT 1',
          args: [code.project_id, code.year],
        })

        if (firstUse.rows.length > 0) {
          const firstDate = new Date(firstUse.rows[0].used_at)

          if (count >= 1) {
            const discountMonth = new Date(firstDate)
            discountMonth.setMonth(discountMonth.getMonth() + 1)
            const monthStr = discountMonth.toISOString().slice(0, 7)

            const existing = await db.execute({
              sql: 'SELECT id FROM discount_ledger WHERE project_id = ? AND referral_use_id = ? AND discount_type = ?',
              args: [code.project_id, useId, '50_next'],
            })

            if (existing.rows.length === 0) {
              await db.execute({
                sql: 'INSERT INTO discount_ledger (id, project_id, year, referral_use_id, discount_type, discount_month) VALUES (?, ?, ?, ?, ?, ?)',
                args: [crypto.randomUUID(), code.project_id, code.year, useId, '50_next', monthStr],
              })
            }
          }

          if (count >= 2) {
            const discountMonth = new Date(firstDate)
            discountMonth.setMonth(discountMonth.getMonth() + 2)
            const monthStr = discountMonth.toISOString().slice(0, 7)

            const existing = await db.execute({
              sql: 'SELECT id FROM discount_ledger WHERE project_id = ? AND discount_type = ? AND discount_month = ?',
              args: [code.project_id, '50_extends', monthStr],
            })

            if (existing.rows.length === 0) {
              await db.execute({
                sql: 'INSERT INTO discount_ledger (id, project_id, year, referral_use_id, discount_type, discount_month) VALUES (?, ?, ?, ?, ?, ?)',
                args: [crypto.randomUUID(), code.project_id, code.year, useId, '50_extends', monthStr],
              })
            }
          }

          if (count >= 3) {
            const extMonth = new Date(firstDate)
            extMonth.setMonth(extMonth.getMonth() + 3)
            const extMonthStr = extMonth.toISOString().slice(0, 7)

            const existingExt = await db.execute({
              sql: 'SELECT id FROM discount_ledger WHERE project_id = ? AND discount_type = ? AND discount_month = ?',
              args: [code.project_id, '50_extends', extMonthStr],
            })

            if (existingExt.rows.length === 0) {
              await db.execute({
                sql: 'INSERT INTO discount_ledger (id, project_id, year, referral_use_id, discount_type, discount_month) VALUES (?, ?, ?, ?, ?, ?)',
                args: [crypto.randomUUID(), code.project_id, code.year, useId, '50_extends', extMonthStr],
              })
            }

            const bonusMonth = new Date(firstDate)
            bonusMonth.setMonth(bonusMonth.getMonth() + 4)
            const bonusMonthStr = bonusMonth.toISOString().slice(0, 7)

            const existingBonus = await db.execute({
              sql: 'SELECT id FROM discount_ledger WHERE project_id = ? AND discount_type = ? AND discount_month = ?',
              args: [code.project_id, '100_bonus', bonusMonthStr],
            })

            if (existingBonus.rows.length === 0) {
              await db.execute({
                sql: 'INSERT INTO discount_ledger (id, project_id, year, referral_use_id, discount_type, discount_month) VALUES (?, ?, ?, ?, ?, ?)',
                args: [crypto.randomUUID(), code.project_id, code.year, useId, '100_bonus', bonusMonthStr],
              })
            }
          }
        }

        return success({ useId, count, message: 'Referral applied' })
      }

      return badRequest('Invalid action')
    }

    return badRequest('Method not allowed')
  } catch (err) {
    return error(500, err.message)
  }
}
