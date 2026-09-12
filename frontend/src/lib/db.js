import { createClient } from '@libsql/client'

let client = null

export function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return client
}

export async function initSchema() {
  const db = getDb()

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      relation_since TEXT,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS client_projects (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      name TEXT NOT NULL,
      github TEXT,
      live TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS referral_codes (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      year INTEGER NOT NULL,
      slot INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES client_projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS referral_uses (
      id TEXT PRIMARY KEY,
      code_id TEXT NOT NULL,
      referee_name TEXT NOT NULL,
      referee_phone TEXT,
      referee_project_id TEXT,
      used_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (code_id) REFERENCES referral_codes(id),
      FOREIGN KEY (referee_project_id) REFERENCES client_projects(id)
    );

    CREATE TABLE IF NOT EXISTS discount_ledger (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      referral_use_id TEXT NOT NULL,
      discount_type TEXT NOT NULL,
      discount_month TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (project_id) REFERENCES client_projects(id),
      FOREIGN KEY (referral_use_id) REFERENCES referral_uses(id)
    );
  `)
}
