const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')
const { requireRole } = require('../middleware/roles')

// All admin routes require auth + admin role
const guard = [requireAuth, attachUser, requireRole('admin')]

// GET /api/admin/stats
router.get('/stats', ...guard, async (req, res, next) => {
  try {
    const [[{ users }]]   = await pool.query('SELECT COUNT(*) AS users FROM users')
    const [[{ events }]]  = await pool.query("SELECT COUNT(*) AS events FROM events WHERE status != 'completed'")
    const [[{ pending }]] = await pool.query("SELECT COUNT(*) AS pending FROM event_proposals WHERE status = 'pending'")
    const [[{ clubs }]]   = await pool.query('SELECT COUNT(*) AS clubs FROM clubs WHERE is_active = 1')
    res.json({ users, events, pending, clubs })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/users
router.get('/users', ...guard, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', ...guard, async (req, res, next) => {
  try {
    const { role } = req.body
    if (!['student', 'coordinator', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'role must be student, coordinator, or admin' })
    }
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/proposals
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

// PATCH /api/admin/proposals/:id  — approve or reject
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
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/proposals (coordinator submits a proposal)
// We expose this here without the admin guard so coordinators can POST
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