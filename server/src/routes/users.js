const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')

/**
 * POST /api/users/sync
 * Called by the frontend immediately after every Clerk sign-in.
 * * New Rule: EVERYONE defaults to 'student'.
 * The role is NEVER reset on subsequent logins once set 
 * (so if an admin changes a student to coordinator, they stay coordinator).
 */
router.post('/sync', requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.auth
    const { emailAddresses, primaryEmailAddress, email, firstName, lastName } = req.body
    const resolvedEmail =
      email ||
      primaryEmailAddress?.emailAddress ||
      emailAddresses?.[0]?.emailAddress ||
      null

    if (!resolvedEmail) return res.status(400).json({ error: 'Email is required' })

    // Default EVERY new user to 'student'
    let initialRole = 'student'
    
    // Developer Seed: Keep your account as admin automatically so you don't get locked out
    if (resolvedEmail === '202451019@iiitvadodara.ac.in') initialRole = 'admin'

    // INSERT or UPDATE — but never overwrite role (preserve admin's manual promotions)
    await pool.query(
      `INSERT INTO users (id, email, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email      = VALUES(email),
         first_name = VALUES(first_name),
         last_name  = VALUES(last_name)`,
      [userId, resolvedEmail, firstName || '', lastName || '', initialRole]
    )

    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// GET /api/users/me
router.get('/me', requireAuth, attachUser, (req, res) => {
  res.json(req.user)
})

// GET /api/users  — admin only (also used in admin.js)
router.get('/', requireAuth, attachUser, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role, created_at
       FROM users ORDER BY created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

module.exports = router