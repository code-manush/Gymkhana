require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()

// ── Security & parsing ─────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: true,
  credentials: true,
}))
app.use('/api/webhooks/clerk', require('./routes/clerkWebhook'))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/users', require('./routes/users'))
app.use('/api/events', require('./routes/events'))
app.use('/api/registrations', require('./routes/registrations'))
app.use('/api/clubs', require('./routes/clubs'))
app.use('/api/results', require('./routes/results'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/coordinator', require('./routes/coordinator'))

// ── Health check ───────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}]`, err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})