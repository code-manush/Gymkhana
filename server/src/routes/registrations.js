const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')

/**
 * GET /api/registrations/my
 * Returns the current user's registrations.
 */
router.get('/my', requireAuth, attachUser, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, e.event_name, e.event_date, e.location,
              e.category, e.status AS event_status, e.visitor_open
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ? AND r.status != 'cancelled'
       ORDER BY e.event_date DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/registrations/:eventId
 * Register current user for an event.
 * Visitors can only register for visitor_open events.
 */
router.post('/:eventId', requireAuth, attachUser, async (req, res, next) => {
  try {
    const { eventId } = req.params
    const { role, id: userId } = req.user

    const [[event]] = await pool.query(
      `SELECT e.capacity, e.status, e.visitor_open,
        (SELECT COUNT(*) FROM registrations r
         WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered
       FROM events e WHERE e.id = ?`,
      [eventId]
    )

    if (!event) return res.status(404).json({ error: 'Event not found' })

    if (event.status === 'completed') {
      return res.status(400).json({ error: 'Event is already completed' })
    }

    // Visitor restriction
    if (role === 'visitor' && !event.visitor_open) {
      return res.status(403).json({
        error: 'This event is only open to IIITV students. Visitors cannot register.',
      })
    }

    if (event.registered >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' })
    }

    await pool.query(
      'INSERT INTO registrations (event_id, user_id) VALUES (?, ?)',
      [eventId, userId]
    )
    res.status(201).json({ success: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'You are already registered for this event' })
    }
    next(err)
  }
})

/**
 * DELETE /api/registrations/:eventId — cancel registration
 */
router.delete('/:eventId', requireAuth, attachUser, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `UPDATE registrations SET status = 'cancelled'
       WHERE event_id = ? AND user_id = ? AND status = 'confirmed'`,
      [req.params.eventId, req.user.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No active registration found' })
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/registrations/:eventId
 * List registrants — admin or assigned coordinator only.
 */
router.get('/:eventId', requireAuth, attachUser, async (req, res, next) => {
  try {
    const { role, id: userId } = req.user
    const eventId = req.params.eventId

    if (role === 'coordinator') {
      const [[assignment]] = await pool.query(
        'SELECT id FROM event_coordinators WHERE event_id = ? AND user_id = ?',
        [eventId, userId]
      )
      if (!assignment) {
        return res.status(403).json({ error: 'You are not the coordinator for this event' })
      }
    } else if (role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' })
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

module.exports = router