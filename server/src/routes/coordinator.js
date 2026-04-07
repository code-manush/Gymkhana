const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')
const { requireRole } = require('../middleware/roles')

// All coordinator routes require at minimum coordinator or admin role
const guard = [requireAuth, attachUser, requireRole('coordinator', 'admin')]

// ── My assigned events ────────────────────────────────────────
// CoordinatorPage.jsx calls GET /api/coordinator/events
router.get('/events', ...guard, async (req, res, next) => {
  try {
    const { id: userId, role } = req.user

    // Admins see all events; coordinators only see assigned ones
    let rows
    if (role === 'admin') {
      ;[rows] = await pool.query(
        `SELECT e.*,
           c.club_name,
           (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered
         FROM events e
         LEFT JOIN clubs c ON e.club_id = c.id
         ORDER BY e.event_date DESC`
      )
    } else {
      ;[rows] = await pool.query(
        `SELECT e.*,
           c.club_name,
           (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered
         FROM events e
         LEFT JOIN clubs c ON e.club_id = c.id
         INNER JOIN event_coordinators ec ON ec.event_id = e.id AND ec.user_id = ?
         ORDER BY e.event_date DESC`,
        [userId]
      )
    }

    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// ── Edit an assigned event ────────────────────────────────────
// CoordinatorPage.jsx calls PUT /api/coordinator/events/:id
router.put('/events/:id', ...guard, async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    const eventId = req.params.id

    // Coordinators can only edit events they are assigned to
    if (role === 'coordinator') {
      const [[assignment]] = await pool.query(
        'SELECT id FROM event_coordinators WHERE event_id = ? AND user_id = ?',
        [eventId, userId]
      )
      if (!assignment) {
        return res.status(403).json({ error: 'You are not the coordinator for this event' })
      }
    }

    const allowed = ['event_name', 'description', 'long_description', 'event_date', 'end_date', 'location', 'capacity', 'status', 'team_size']
    const toUpdate = allowed.filter(f => req.body[f] !== undefined)
    if (!toUpdate.length) return res.status(400).json({ error: 'No valid fields to update' })

    const sql = `UPDATE events SET ${toUpdate.map(f => `${f} = ?`).join(', ')} WHERE id = ?`
    await pool.query(sql, [...toUpdate.map(f => req.body[f]), eventId])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ── Registrations for an assigned event ───────────────────────
// CoordinatorPage.jsx calls GET /api/coordinator/events/:id/registrations
router.get('/events/:id/registrations', ...guard, async (req, res, next) => {
  try {
    const { id: userId, role } = req.user
    const eventId = req.params.id

    if (role === 'coordinator') {
      const [[assignment]] = await pool.query(
        'SELECT id FROM event_coordinators WHERE event_id = ? AND user_id = ?',
        [eventId, userId]
      )
      if (!assignment) {
        return res.status(403).json({ error: 'You are not the coordinator for this event' })
      }
    }

    const [rows] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.email, u.role AS user_role
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ? AND r.status = 'confirmed'
       ORDER BY r.registered_at ASC`,
      [eventId]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// ── My proposals ──────────────────────────────────────────────
// CoordinatorPage.jsx calls GET /api/coordinator/proposals
router.get('/proposals', ...guard, async (req, res, next) => {
  try {
    const { id: userId, role } = req.user

    // Admins see all proposals; coordinators only see their own
    let rows
    if (role === 'admin') {
      ;[rows] = await pool.query(
        `SELECT p.*, c.club_name,
           CONCAT(u.first_name, ' ', u.last_name) AS proposed_by_name
         FROM event_proposals p
         LEFT JOIN clubs c ON p.club_id    = c.id
         LEFT JOIN users u ON p.proposed_by = u.id
         ORDER BY p.created_at DESC`
      )
    } else {
      ;[rows] = await pool.query(
        `SELECT p.*, c.club_name
         FROM event_proposals p
         LEFT JOIN clubs c ON p.club_id = c.id
         WHERE p.proposed_by = ?
         ORDER BY p.created_at DESC`,
        [userId]
      )
    }

    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// ── Submit a new proposal ─────────────────────────────────────
// CoordinatorPage.jsx calls POST /api/coordinator/proposals
router.post('/proposals', ...guard, async (req, res, next) => {
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
})

module.exports = router