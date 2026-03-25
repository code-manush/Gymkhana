const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')

// Called by frontend right after sign-in to create/update the user row
router.post('/sync', requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.auth
    const { emailAddresses, firstName, lastName } = req.body
    const email = emailAddresses?.[0]?.emailAddress

    if (!email) return res.status(400).json({ error: 'Email is required' })

    await pool.query(
      `INSERT INTO users (id, email, first_name, last_name)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email      = VALUES(email),
         first_name = VALUES(first_name),
         last_name  = VALUES(last_name)`,
      [userId, email, firstName || '', lastName || '']
    )

    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// Get the currently signed-in user
router.get('/me', requireAuth, attachUser, (req, res) => {
  res.json(req.user)
})

// Get all users — admin only (imported in admin.js instead)
router.get('/', requireAuth, attachUser, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

module.exports = router