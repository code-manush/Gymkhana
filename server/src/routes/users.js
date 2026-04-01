const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')

/**
 * POST /api/users/sync
 * Called by the frontend immediately after every Clerk sign-in.
 *
 * Role assignment rules:
 *  - @iiitvadodara.ac.in  → student (or admin if it's the seed email)
 *  - any other email       → visitor
 *
 * The role column is NEVER reset on subsequent logins once set
 * (an admin manually promoting someone to coordinator stays coordinator).
 */
router.post('/sync', requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.auth
    const { emailAddresses, firstName, lastName } = req.body
    const email = emailAddresses?.[0]?.emailAddress

    if (!email) return res.status(400).json({ error: 'Email is required' })

    const isCollegeEmail = email.endsWith('@iiitvadodara.ac.in')

    // Seed admin gets admin; other college emails start as student;
    // everyone else is visitor.
    let initialRole = isCollegeEmail ? 'student' : 'visitor'
    if (email === '202451019@iiitvadodara.ac.in') initialRole = 'admin'

    // INSERT or UPDATE — but never overwrite role (preserve manual promotions)
    await pool.query(
      `INSERT INTO users (id, email, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email      = VALUES(email),
         first_name = VALUES(first_name),
         last_name  = VALUES(last_name)`,
      [userId, email, firstName || '', lastName || '', initialRole]
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