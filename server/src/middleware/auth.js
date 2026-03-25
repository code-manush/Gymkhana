const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')
const pool = require('../config/db')

// Verifies Clerk JWT — attaches req.auth (userId, sessionId)
const requireAuth = ClerkExpressRequireAuth()

// After requireAuth, fetch the user row from our DB
const attachUser = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.auth.userId]
    )
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found in DB. Try logging out and back in.' })
    }
    req.user = rows[0]
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { requireAuth, attachUser }