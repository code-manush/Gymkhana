const { requireRole } = require('../src/middleware/roles')

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
}

describe('requireRole middleware', () => {
  test('returns 401 when req.user is missing', () => {
    const req = {}
    const res = createRes()
    const next = jest.fn()

    requireRole('admin')(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({ error: 'Not authenticated' })
    expect(next).not.toHaveBeenCalled()
  })

  test('returns 403 for insufficient role', () => {
    const req = { user: { role: 'student' } }
    const res = createRes()
    const next = jest.fn()

    requireRole('admin')(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({ error: 'Insufficient permissions' })
    expect(next).not.toHaveBeenCalled()
  })

  test('calls next for allowed role', () => {
    const req = { user: { role: 'admin' } }
    const res = createRes()
    const next = jest.fn()

    requireRole('admin', 'coordinator')(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })
})
