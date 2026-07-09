const express = require('express')
const request = require('supertest')

let mockCurrentUser = { id: 'u1', role: 'student' }

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}))

jest.mock('../src/middleware/auth', () => ({
  requireAuth: (req, res, next) => next(),
  attachUser: (req, res, next) => {
    req.user = mockCurrentUser
    next()
  },
}))

const pool = require('../src/config/db')
const registrationsRouter = require('../src/routes/registrations')

function createApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/registrations', registrationsRouter)
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
  })
  return app
}

describe('registrations routes', () => {
  beforeEach(() => {
    mockCurrentUser = { id: 'u1', role: 'student' }
    pool.query.mockReset()
  })

  test('GET /api/registrations/my returns current user registrations', async () => {
    pool.query.mockResolvedValueOnce([[
      {
        id: 10,
        event_id: 2,
        user_id: 'u1',
        event_name: 'Hackathon',
      },
    ]])

    const app = createApp()
    const res = await request(app).get('/api/registrations/my')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0].event_name).toBe('Hackathon')
  })

  test('POST /api/registrations/:eventId blocks visitors for non-open event', async () => {
    mockCurrentUser = { id: 'v1', role: 'visitor' }
    pool.query.mockResolvedValueOnce([[
      {
        capacity: 100,
        status: 'registration_open',
        visitor_open: 0,
        registered: 10,
      },
    ]])

    const app = createApp()
    const res = await request(app).post('/api/registrations/5')

    expect(res.status).toBe(403)
    expect(res.body.error).toMatch(/not open to IIITV students|Visitors cannot register/i)
  })

  test('POST /api/registrations/:eventId handles duplicate registration', async () => {
    pool.query
      .mockResolvedValueOnce([[
        {
          capacity: 100,
          status: 'registration_open',
          visitor_open: 1,
          registered: 10,
        },
      ]])
      .mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' })

    const app = createApp()
    const res = await request(app).post('/api/registrations/5')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'You are already registered for this event' })
  })
})
