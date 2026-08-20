const test = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const path = require('node:path')

let server
let baseUrl

async function request(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()
  return { response, body }
}

test.before(async () => {
  server = spawn(process.execPath, [path.join(__dirname, 'app.js')], {
    cwd: __dirname,
    env: { ...process.env, PORT: '3127', DELETE_TOKEN: 'test-token' }
  })
  baseUrl = 'http://127.0.0.1:3127'
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await fetch(`${baseUrl}/api/v1/confessions`)
      return
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }
  throw new Error('server did not start')
})

test.after(() => server.kill())

test('preserves the documented confession workflow', async () => {
  const created = await request('/api/v1/confessions', {
    method: 'POST',
    body: JSON.stringify({ text: 'The refactor made this endpoint easier to understand.', category: 'bug' })
  })
  assert.equal(created.response.status, 201)
  assert.equal(created.body.category, 'bug')

  const listed = await request('/api/v1/confessions')
  assert.equal(listed.response.status, 200)
  assert.equal(listed.body.count, 1)

  const category = await request('/api/v1/confessions/category/bug')
  assert.equal(category.response.status, 200)
  assert.equal(category.body.length, 1)

  const found = await request(`/api/v1/confessions/${created.body.id}`)
  assert.equal(found.response.status, 200)
  assert.equal(found.body.text, created.body.text)

  const unauthorizedDelete = await request(`/api/v1/confessions/${created.body.id}`, { method: 'DELETE' })
  assert.equal(unauthorizedDelete.response.status, 403)

  const deleted = await request(`/api/v1/confessions/${created.body.id}`, {
    method: 'DELETE',
    headers: { 'x-delete-token': 'test-token' }
  })
  assert.equal(deleted.response.status, 200)
  assert.equal(deleted.body.item.id, created.body.id)
})

 test('rejects invalid confession input', async () => {
  const invalid = await request('/api/v1/confessions', {
    method: 'POST',
    body: JSON.stringify({ text: 'missing category' })
  })
  assert.equal(invalid.response.status, 400)
  assert.equal(invalid.body, 'category not in stuff')
})
