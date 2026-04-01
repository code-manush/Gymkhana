const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')
const { requireRole } = require('../middleware/roles')

/**
 * GET /api/events
 * - visitors only see events where visitor_open = 1
 * - students / coordinators / admins see all events
 * Query params: category, status, search
 */
router.get('/', requireAuth, attachUser, async (req, res, next) => {
  try {
    const { category, status, search } = req.query
    const isVisitor = req.user.role === 'visitor'

    let sql = `
      SELECT
        e.*,
        c.club_name,
        (SELECT COUNT(*) FROM registrations r
         WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      WHERE 1=1
    `
    const params = []

    // Visitors can only see visitor-open events
    if (isVisitor) {
      sql += ' AND e.visitor_open = 1'
    }

    if (category && category !== 'All') {
      sql += ' AND e.category = ?'
      params.push(category)
    }
    if (status && status !== 'All') {
      sql += ' AND e.status = ?'
      params.push(status)
    }
    if (search) {
      sql += ' AND (e.event_name LIKE ? OR e.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY e.event_date ASC'
    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/events/:id
 * Visitors can only fetch visitor_open events.
 */
router.get('/:id', requireAuth, attachUser, async (req, res, next) => {
  try {
    const [[event]] = await pool.query(
      `SELECT
        e.*,
        c.club_name, c.id AS club_db_id,
        CONCAT(u.first_name, ' ', u.last_name) AS coordinator,
        (SELECT COUNT(*) FROM registrations r
         WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered
       FROM events e
       LEFT JOIN clubs c ON e.club_id       = c.id
       LEFT JOIN users u ON c.coordinator_id = u.id
       WHERE e.id = ?`,
      [req.params.id]
    )
    if (!event) return res.status(404).json({ error: 'Event not found' })

    if (req.user.role === 'visitor' && !event.visitor_open) {
      return res.status(403).json({ error: 'This event is not open to visitors' })
    }

    res.json(event)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/events  — admin only
 * Coordinators propose events via /api/admin/proposals instead.
 */
router.post(
  '/',
  requireAuth, attachUser, requireRole('admin'),
  async (req, res, next) => {
    try {
      const {
        event_name, description, long_description,
        event_date, end_date, location, capacity,
        club_id, category, status, team_size,
        prizes, schedule, visitor_open,
      } = req.body

      if (!event_name || !event_date || !category || !capacity) {
        return res.status(400).json({
          error: 'event_name, event_date, category and capacity are required',
        })
      }

      const [result] = await pool.query(
        `INSERT INTO events
          (event_name, description, long_description, event_date, end_date,
           location, capacity, club_id, category, status, visitor_open,
           team_size, prizes, schedule)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          event_name, description, long_description,
          event_date, end_date || null, location, capacity,
          club_id || null, category, status || 'upcoming',
          visitor_open ? 1 : 0,
          team_size || null,
          prizes   ? JSON.stringify(prizes)   : null,
          schedule ? JSON.stringify(schedule) : null,
        ]
      )
      res.status(201).json({ id: result.insertId })
    } catch (err) {
      next(err)
    }
  }
)

/**
 * PUT /api/events/:id  — admin or assigned coordinator
 */
router.put(
  '/:id',
  requireAuth, attachUser,
  async (req, res, next) => {
    try {
      const { role, id: userId } = req.user
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
      } else if (role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      const coordinatorAllowed = [
        'event_name','description','long_description',
        'event_date','end_date','location','capacity','status','team_size',
      ]
      const adminOnly = ['visitor_open', 'club_id', 'category']
      const allowed = role === 'admin'
        ? [...coordinatorAllowed, ...adminOnly]
        : coordinatorAllowed

      const toUpdate = allowed.filter(f => req.body[f] !== undefined)
      if (!toUpdate.length) return res.status(400).json({ error: 'No valid fields to update' })

      const sql = `UPDATE events SET ${toUpdate.map(f => `${f} = ?`).join(', ')} WHERE id = ?`
      await pool.query(sql, [...toUpdate.map(f => req.body[f]), eventId])
      res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }
)

/**
 * DELETE /api/events/:id — admin only
 */
router.delete(
  '/:id',
  requireAuth, attachUser, requireRole('admin'),
  async (req, res, next) => {
    try {
      await pool.query('DELETE FROM events WHERE id = ?', [req.params.id])
      res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router