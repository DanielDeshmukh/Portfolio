import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';
import { getDb, initSchema } from '../../../lib/db';
import crypto from 'crypto';

async function ensureTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS earnings (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'INR',
      type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      paid_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES client_projects(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);
}

export async function GET(request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const db = await getDb();
    await ensureTable(db);

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const projectId = searchParams.get('project_id');
    const status = searchParams.get('status');
    const year = searchParams.get('year');

    let where = [];
    let params = [];

    if (clientId) {
      where.push('e.client_id = ?');
      params.push(clientId);
    }
    if (projectId) {
      where.push('e.project_id = ?');
      params.push(projectId);
    }
    if (status) {
      where.push('e.status = ?');
      params.push(status);
    }
    if (year) {
      where.push("strftime('%Y', e.created_at) = ?");
      params.push(year);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const earnings = await db.all(
      `SELECT e.*, c.name AS client_name, cp.title AS project_name
       FROM earnings e
       LEFT JOIN clients c ON e.client_id = c.id
       LEFT JOIN client_projects cp ON e.project_id = cp.id
       ${whereClause}
       ORDER BY e.created_at DESC`,
      ...params
    );

    const summaryRow = await db.get(
      `SELECT
         COALESCE(SUM(amount), 0) AS total,
         COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS paid,
         COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pending
       FROM earnings e
       ${whereClause}`,
      ...params
    );

    const byClient = await db.all(
      `SELECT c.name AS client_name, COALESCE(SUM(e.amount), 0) AS total
       FROM earnings e
       LEFT JOIN clients c ON e.client_id = c.id
       ${whereClause}
       GROUP BY e.client_id
       ORDER BY total DESC`,
      ...params
    );

    return NextResponse.json({
      ok: true,
      earnings,
      summary: {
        total: summaryRow.total,
        paid: summaryRow.paid,
        pending: summaryRow.pending,
        byClient,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const db = await getDb();
    await ensureTable(db);

    const body = await request.json();
    const { client_id, project_id, amount, currency, type, description, status, paid_at } = body;

    if (!client_id || !project_id || amount == null || !type) {
      return NextResponse.json(
        { ok: false, error: 'client_id, project_id, amount, and type are required' },
        { status: 400 }
      );
    }

    const validTypes = ['project_payment', 'referral_bonus', 'maintenance', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { ok: false, error: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await db.run(
      `INSERT INTO earnings (id, project_id, client_id, amount, currency, type, description, status, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      project_id,
      client_id,
      amount,
      currency || 'INR',
      type,
      description || null,
      status || 'pending',
      paid_at || null
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const db = await getDb();
    await ensureTable(db);

    const body = await request.json();
    const { id, amount, status, paid_at, description } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
    }

    const sets = [];
    const params = [];

    if (amount !== undefined) {
      sets.push('amount = ?');
      params.push(amount);
    }
    if (status !== undefined) {
      sets.push('status = ?');
      params.push(status);
    }
    if (paid_at !== undefined) {
      sets.push('paid_at = ?');
      params.push(paid_at);
    }
    if (description !== undefined) {
      sets.push('description = ?');
      params.push(description);
    }

    if (!sets.length) {
      return NextResponse.json({ ok: false, error: 'No fields to update' }, { status: 400 });
    }

    params.push(id);
    await db.run(`UPDATE earnings SET ${sets.join(', ')} WHERE id = ?`, ...params);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const db = await getDb();
    await ensureTable(db);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ ok: false, error: 'id query param is required' }, { status: 400 });
    }

    await db.run('DELETE FROM earnings WHERE id = ?', id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
