const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')
const { requireRole } = require('../middleware/roles')

const guard = [requireAuth, attachUser, requireRole('admin')]

// ── Stats ─────────────────────────────────────────────────────
router.get('/stats', ...guard, async (req, res, next) => {
  try {
    const [[{ users }]]    = await pool.query('SELECT COUNT(*) AS users FROM users')
    const [[{ students }]] = await pool.query("SELECT COUNT(*) AS students FROM users WHERE role = 'student'")
    const [[{ visitors }]] = await pool.query("SELECT COUNT(*) AS visitors FROM users WHERE role = 'visitor'")
    const [[{ events }]]   = await pool.query("SELECT COUNT(*) AS events FROM events WHERE status != 'completed'")
    const [[{ pending }]]  = await pool.query("SELECT COUNT(*) AS pending FROM event_proposals WHERE status = 'pending'")
    const [[{ clubs }]]    = await pool.query('SELECT COUNT(*) AS clubs FROM clubs WHERE is_active = 1')
    res.json({ users, students, visitors, events, pending, clubs })
  } catch (err) {
    next(err)
  }
})

// ── Users list ────────────────────────────────────────────────
router.get('/users', ...guard, async (req, res, next) => {
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

// ── Update user role ─────────────────────────────────────────
// Admin can set any user to: student | coordinator | admin | visitor
// Note: promoting to coordinator also expects an event assignment (see below).
router.patch('/users/:id/role', ...guard, async (req, res, next) => {
  try {
    const { role } = req.body
    if (!['student', 'coordinator', 'admin', 'visitor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ── Assign coordinator to an event ───────────────────────────
// POST /api/admin/events/:eventId/coordinator
// Body: { userId }  — user must have a college email
// Steps: 1) verify college email, 2) set role = coordinator, 3) insert event_coordinators row
router.post('/events/:eventId/coordinator', ...guard, async (req, res, next) => {
  try {
    const { userId } = req.body
    const { eventId } = req.params

    if (!userId) return res.status(400).json({ error: 'userId is required' })

    // Fetch the user
    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Only college-email users can be coordinators
    if (!user.email.endsWith('@iiitvadodara.ac.in')) {
      return res.status(400).json({
        error: 'Only @iiitvadodara.ac.in users can be assigned as coordinators',
      })
    }

    // Verify event exists
    const [[event]] = await pool.query('SELECT id FROM events WHERE id = ?', [eventId])
    if (!event) return res.status(404).json({ error: 'Event not found' })

    // Promote to coordinator role
    await pool.query("UPDATE users SET role = 'coordinator' WHERE id = ?", [userId])

    // Insert assignment (ignore duplicate)
    await pool.query(
      `INSERT INTO event_coordinators (event_id, user_id, assigned_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE assigned_by = VALUES(assigned_by), assigned_at = CURRENT_TIMESTAMP`,
      [eventId, userId, req.user.id]
    )

    res.status(201).json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ── Remove coordinator from event ────────────────────────────
// DELETE /api/admin/events/:eventId/coordinator/:userId
router.delete('/events/:eventId/coordinator/:userId', ...guard, async (req, res, next) => {
  try {
    const { eventId, userId } = req.params

    await pool.query(
      'DELETE FROM event_coordinators WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    )

    // Check if the user still coordinates any other events; if not, revert to student
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM event_coordinators WHERE user_id = ?',
      [userId]
    )
    if (count === 0) {
      await pool.query("UPDATE users SET role = 'student' WHERE id = ?", [userId])
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ── Toggle event visitor access ───────────────────────────────
// PATCH /api/admin/events/:eventId/visitor-access
// Body: { visitor_open: true | false }
router.patch('/events/:eventId/visitor-access', ...guard, async (req, res, next) => {
  try {
    const { visitor_open } = req.body
    await pool.query(
      'UPDATE events SET visitor_open = ? WHERE id = ?',
      [visitor_open ? 1 : 0, req.params.eventId]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ── Proposals list ────────────────────────────────────────────
router.get('/proposals', ...guard, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        p.*,
        c.club_name,
        CONCAT(u.first_name, ' ', u.last_name) AS coordinator,
        u.email AS coordinator_email
       FROM event_proposals p
       LEFT JOIN clubs c ON p.club_id    = c.id
       LEFT JOIN users u ON p.proposed_by = u.id
       ORDER BY p.created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// ── Approve / reject proposal ─────────────────────────────────
router.patch('/proposals/:id', ...guard, async (req, res, next) => {
  try {
    const { status, admin_notes } = req.body
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status must be approved or rejected' })
    }
    await pool.query(
      'UPDATE event_proposals SET status = ?, admin_notes = ? WHERE id = ?',
      [status, admin_notes || null, req.params.id]
    )
    // If approved, create the actual event
    if (status === 'approved') {
      const [[p]] = await pool.query('SELECT * FROM event_proposals WHERE id = ?', [req.params.id])
      await pool.query(
        `INSERT INTO events (event_name, description, event_date, location, capacity, club_id, category)
         VALUES (?, ?, ?, ?, ?, ?, 'Technical')`,
        [p.event_name, p.description, p.proposed_date, p.location, p.capacity, p.club_id]
      )
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ── Submit proposal (coordinator) ────────────────────────────
router.post(
  '/proposals',
  requireAuth, attachUser, requireRole('admin', 'coordinator'),
  async (req, res, next) => {
    try {
      const { event_name, description, proposed_date, location, capacity, club_id } = req.body
      if (!event_name || !proposed_date) {
        return res.status(400).json({ error: 'event_name and proposed_date are required' })
      }
      const [result] = await pool.query(
        `INSERT INTO event_proposals
          (event_name, description, proposed_date, location, capacity, club_id, proposed_by)
         VALUES (?,?,?,?,?,?,?)`,
        [event_name, description, proposed_date, location, capacity, club_id || null, req.user.id]
      )
      res.status(201).json({ id: result.insertId })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router