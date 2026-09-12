import { NextResponse } from 'next/server'
import { verifyPassword, signToken } from '../../../lib/auth'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Username and password required' }, { status: 400 })
    }

    if (username !== 'daniel' || !verifyPassword(password)) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 400 })
    }

    const token = signToken({ username, role: 'admin' })
    return NextResponse.json({ ok: true, token, username })
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Login failed: ' + err.message }, { status: 400 })
  }
}
