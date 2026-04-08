const router = require('express').Router()
const pool = require('../config/db')
const { requireAuth, attachUser } = require('../middleware/auth')
const { requireRole } = require('../middleware/roles')

// GET /api/clubs
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { category } = req.query
    let sql = `
      SELECT
        c.*,
        CONCAT(u.first_name, ' ', u.last_name) AS coordinator,
        (SELECT COUNT(*) FROM club_memberships m WHERE m.club_id = c.id) AS member_count,
        (SELECT COUNT(*) FROM events e WHERE e.club_id = c.id) AS event_count
      FROM clubs c
      LEFT JOIN users u ON c.coordinator_id = u.id
      WHERE c.is_active = 1
    `
    const params = []
    if (category && category !== 'All') {
      sql += ' AND c.category = ?'
      params.push(category)
    }
    sql += ' ORDER BY c.club_name ASC'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/clubs/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const [[club]] = await pool.query(
      `SELECT
        c.*,
        CONCAT(u.first_name, ' ', u.last_name) AS coordinator,
        u.email AS coordinator_email,
        (SELECT COUNT(*) FROM club_memberships m WHERE m.club_id = c.id) AS member_count,
        (SELECT COUNT(*) FROM events e WHERE e.club_id = c.id) AS event_count
       FROM clubs c
       LEFT JOIN users u ON c.coordinator_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    )
    if (!club) return res.status(404).json({ error: 'Club not found' })

    const [events] = await pool.query(
      `SELECT e.*,
        (SELECT COUNT(*) FROM registrations r
         WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered
       FROM events e
       WHERE e.club_id = ?
       ORDER BY e.event_date DESC
       LIMIT 6`,
      [req.params.id]
    )

    res.json({ ...club, events })
  } catch (err) {
    next(err)
  }
})

// POST /api/clubs/:id/join
router.post('/:id/join', requireAuth, attachUser, async (req, res, next) => {
  try {
    await pool.query(
      'INSERT INTO club_memberships (user_id, club_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    )
    res.status(201).json({ success: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Already a member of this club' })
    }
    next(err)
  }
})

// DELETE /api/clubs/:id/leave
router.delete('/:id/leave', requireAuth, attachUser, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM club_memberships WHERE user_id = ? AND club_id = ?',
      [req.user.id, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Not a member of this club' })
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/clubs  — create club (admin only)
router.post(
  '/',
  requireAuth, attachUser, requireRole('admin'),
  async (req, res, next) => {
    try {
      const { club_name, description, long_description, category, coordinator_id, founded } = req.body
      if (!club_name || !category) {
        return res.status(400).json({ error: 'club_name and category are required' })
      }
      const [result] = await pool.query(
        `INSERT INTO clubs (club_name, description, long_description, category, coordinator_id, founded)
         VALUES (?,?,?,?,?,?)`,
        [club_name, description, long_description, category, coordinator_id || null, founded || null]
      )
      res.status(201).json({ id: result.insertId })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router