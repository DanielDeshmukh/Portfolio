function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: JSON.stringify(body),
  }
}

function optionsResponse() {
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: '',
  }
}

function success(data) {
  return jsonResponse(200, { ok: true, ...data })
}

function error(statusCode, message) {
  return jsonResponse(statusCode, { ok: false, error: message })
}

function unauthorized() {
  return error(401, 'Unauthorized')
}

function badRequest(message) {
  return error(400, message)
}

function notFound(message) {
  return error(404, message)
}

module.exports = { jsonResponse, optionsResponse, success, error, unauthorized, badRequest, notFound }
