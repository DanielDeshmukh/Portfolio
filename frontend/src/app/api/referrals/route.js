import { NextResponse } from 'next/server'
import { requireAuth } from '../../../lib/auth'
import { getDb, initSchema } from '../../../lib/db'
import crypto from 'crypto'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'SGP-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function GET(request) {
  if (!requireAuth(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initSchema()
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const year = searchParams.get('year') || new Date().getFullYear()

    if (!projectId) {
      return NextResponse.json({ ok: false, error: 'project_id required' }, { status: 400 })
    }

    const codes = await db.execute({
      sql: 'SELECT * FROM referral_codes WHERE project_id = ? AND year = ? ORDER BY slot',
      args: [projectId, parseInt(year)],
    })

    const codeIds = codes.rows.map(c => c.id)
    let uses = []
    if (codeIds.length > 0) {
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

    return NextResponse.json({
      ok: true,
      codes: codes.rows,
      uses: uses.rows,
      discounts: discounts.rows,
    })
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
    const body = await request.json()
    const action = body.action

    if (action === 'generate') {
      const { project_id, year } = body
      if (!project_id) {
        return NextResponse.json({ ok: false, error: 'project_id required' }, { status: 400 })
      }

      const yr = year || new Date().getFullYear()
      const existing = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM referral_codes WHERE project_id = ? AND year = ?',
        args: [project_id, yr],
      })

      if (existing.rows[0].count >= 3) {
        return NextResponse.json({ ok: false, error: 'Already 3 codes exist for this project this year' }, { status: 400 })
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

      return NextResponse.json({ ok: true, codes, message: '3 codes generated' })
    }

    if (action === 'apply') {
      const { code_id, referee_name, referee_phone, referee_project_id } = body
      if (!code_id || !referee_name) {
        return NextResponse.json({ ok: false, error: 'code_id and referee_name required' }, { status: 400 })
      }

      const codeRow = await db.execute({
        sql: 'SELECT * FROM referral_codes WHERE id = ? AND status = ?',
        args: [code_id, 'active'],
      })

      if (codeRow.rows.length === 0) {
        return NextResponse.json({ ok: false, error: 'Code not found or already used' }, { status: 400 })
      }
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

      return NextResponse.json({ ok: true, useId, count, message: 'Referral applied' })
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
