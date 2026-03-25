const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')
const { requireRole } = require('../middleware/roles')

// GET /api/results  — all published results
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        r.id, r.position, r.score, r.notes,
        e.id AS event_id, e.event_name, e.event_date, e.category,
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS participant_name,
        u.email
       FROM results r
       JOIN events e ON r.event_id = e.id
       JOIN users  u ON r.user_id  = u.id
       ORDER BY e.event_date DESC, r.position ASC`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/results/event/:eventId  — results for one event
router.get('/event/:eventId', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        r.position, r.score, r.notes,
        CONCAT(u.first_name, ' ', u.last_name) AS name,
        u.email
       FROM results r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ?
       ORDER BY r.position ASC`,
      [req.params.eventId]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// POST /api/results  — publish results (admin only)
// Body: { event_id: 1, standings: [{ user_id, position, score }] }
router.post(
  '/',
  requireAuth, attachUser, requireRole('admin'),
  async (req, res, next) => {
    const conn = await pool.getConnection()
    try {
      const { event_id, standings } = req.body
      if (!event_id || !Array.isArray(standings) || !standings.length) {
        return res.status(400).json({ error: 'event_id and standings[] are required' })
      }

      await conn.beginTransaction()

      // Delete any previous results for this event first
      await conn.query('DELETE FROM results WHERE event_id = ?', [event_id])

      const values = standings.map(s => [event_id, s.user_id, s.position, s.score ?? null])
      await conn.query(
        'INSERT INTO results (event_id, user_id, position, score) VALUES ?',
        [values]
      )

      // Mark the event as completed
      await conn.query(
        "UPDATE events SET status = 'completed' WHERE id = ?",
        [event_id]
      )

      await conn.commit()
      res.status(201).json({ success: true })
    } catch (err) {
      await conn.rollback()
      next(err)
    } finally {
      conn.release()
    }
  }
)

module.exports = router