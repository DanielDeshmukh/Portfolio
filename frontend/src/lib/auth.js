import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function verifyPassword(password) {
  if (!ADMIN_HASH) return false
  return bcrypt.compareSync(password, ADMIN_HASH)
}

export function getBearerToken(request) {
  const auth = request.headers.get('authorization') || ''
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7)
  }
  return null
}

export function requireAuth(request) {
  const token = getBearerToken(request)
  if (!token) return null
  return verifyToken(token)
}
