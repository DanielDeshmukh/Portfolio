const { verifyPassword, signToken } = require('./_shared/auth')
const { initSchema } = require('./_shared/db')
const { success, badRequest, optionsResponse } = require('./_shared/response')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return optionsResponse()
  if (event.httpMethod !== 'POST') return badRequest('Method not allowed')

  try {
    await initSchema()
    const { username, password } = JSON.parse(event.body || '{}')

    if (!username || !password) {
      return badRequest('Username and password required')
    }

    if (username !== 'daniel' || !verifyPassword(password)) {
      return badRequest('Invalid credentials')
    }

    const token = signToken({ username, role: 'admin' })
    return success({ token, username })
  } catch (err) {
    return badRequest('Login failed: ' + err.message)
  }
}
