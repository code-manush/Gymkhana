const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')
const { clerkClient } = require('@clerk/clerk-sdk-node')
const pool = require('../config/db')

// Verifies Clerk JWT — attaches req.auth (userId, sessionId)
const requireAuth = ClerkExpressRequireAuth()

// After requireAuth, fetch the user row from our DB
const attachUser = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const claims = req.auth.sessionClaims || {}

    let [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    )

    // If user is missing in DB, fetch profile from Clerk and create it automatically.
    if (!rows.length) {
      // Prefer token claims first to avoid hard dependency on Clerk profile fetch.
      let email =
        claims.email ||
        claims?.primary_email_address?.email_address ||
        null

      let firstName = claims.given_name || ''
      let lastName = claims.family_name || ''

      if (!email) {
        const clerkUser = await clerkClient.users.getUser(userId)
        email =
          clerkUser?.primaryEmailAddress?.emailAddress ||
          clerkUser?.emailAddresses?.[0]?.emailAddress ||
          null
        firstName = clerkUser?.firstName || firstName
        lastName = clerkUser?.lastName || lastName
      }

      if (!email) {
        return res.status(400).json({ error: 'Authenticated Clerk user has no email address.' })
      }

      let initialRole = 'student'
      if (email === '202451019@iiitvadodara.ac.in') initialRole = 'admin'

      await pool.query(
        `INSERT INTO users (id, email, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           email      = VALUES(email),
           first_name = VALUES(first_name),
           last_name  = VALUES(last_name)`,
        [
          userId,
          email,
          firstName,
          lastName,
          initialRole,
        ]
      )

        ;[rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
      if (!rows.length) {
        return res.status(500).json({ error: 'Failed to create user in DB.' })
      }
    }

    req.user = rows[0]
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { requireAuth, attachUser }