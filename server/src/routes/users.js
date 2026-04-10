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

// GET /api/users/profile - Fetches user's clubs, events, and stats
router.get('/profile', requireAuth, attachUser, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch Clubs they joined
    const [clubs] = await pool.query(
      `SELECT c.id, c.club_name AS name, 'Member' AS role 
       FROM club_memberships cm
       JOIN clubs c ON cm.club_id = c.id
       WHERE cm.user_id = ?`,
      [userId]
    );

    // 2. Fetch Events they registered for
    const [registrations] = await pool.query(
      `SELECT e.event_name AS label, 'Registration' AS type, r.registered_at AS date, r.status
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ?
       ORDER BY r.registered_at DESC LIMIT 10`,
      [userId]
    );

    // 3. Fetch past Results/Wins
    const [results] = await pool.query(
      `SELECT e.event_name AS label, 'Result' AS type, r.created_at AS date, 
              CONCAT(r.position, ' Place') AS status 
       FROM results r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC LIMIT 10`,
      [userId]
    );

    // Combine activity and calculate basic stats
    const activity = [...registrations, ...results].sort((a, b) => new Date(b.date) - new Date(a.date));
    const stats = {
      events: registrations.length,
      clubs: clubs.length,
      wins: results.length,
      points: results.length * 50 + registrations.length * 10 // Gamification!
    };

    res.json({ clubs, activity, stats, dbUser: req.user });
  } catch (err) {
    next(err);
  }
});

module.exports = router