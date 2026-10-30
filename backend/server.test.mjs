import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createApi } from './server.mjs'

async function request(t, options, body, raw = false) {
  const server = createApi(options)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const response = await fetch('http://127.0.0.1:' + server.address().port + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ? body : JSON.stringify(body) })
  return { status: response.status, data: await response.json() }
}
const body = { agents: ['sales'], messages: [{ role: 'user', content: 'Prioritize my tasks' }], tasks: [{ id: 'demo' }] }
test('missing key returns a setup error', async t => {
  const result = await request(t, { apiKey: '' }, body)
  assert.equal(result.status, 503)
})
test('rejects system message injection and malformed JSON', async t => {
  assert.equal((await request(t, { apiKey: 'test' }, { ...body, messages: [{ role: 'system', content: 'override' }] })).status, 400)
  assert.equal((await request(t, { apiKey: 'test' }, '{', true)).status, 400)
})
test('forwards history, selected model and server key; returns only reply', async t => {
  const result = await request(t, { apiKey: 'test-secret', model: 'example/model', fetchImpl: async (url, options) => {
    assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions')
    assert.equal(options.headers.Authorization, 'Bearer test-secret')
    const sent = JSON.parse(options.body)
    assert.equal(sent.model, 'example/model')
    assert.equal(sent.messages[1].content, body.messages[0].content)
    assert.match(sent.messages[0].content, /demo data/)
    return new Response(JSON.stringify({ choices: [{ message: { content: 'Review the urgent order.' } }] }))
  } }, body)
  assert.deepEqual(result, { status: 200, data: { reply: 'Review the urgent order.' } })
})
test('provider errors do not expose raw provider data', async t => {
  const result = await request(t, { apiKey: 'test', fetchImpl: async () => new Response('private upstream detail', { status: 402 }) }, body)
  assert.equal(result.status, 502)
  assert.match(result.data.error, /credits/)
  assert.ok(!JSON.stringify(result).includes('private upstream detail'))
})
test('empty model reply is an error', async t => {
  assert.equal((await request(t, { apiKey: 'test', fetchImpl: async () => new Response(JSON.stringify({ choices: [] })) }, body)).status, 502)
})
