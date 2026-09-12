const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

function verifyPassword(password) {
  if (!ADMIN_HASH) return false
  return bcrypt.compareSync(password, ADMIN_HASH)
}

function getBearerToken(event) {
  const auth = event.headers?.authorization || ''
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7)
  }
  return null
}

function requireAuth(event) {
  const token = getBearerToken(event)
  if (!token) return null
  return verifyToken(token)
}

module.exports = { signToken, verifyToken, verifyPassword, requireAuth }
