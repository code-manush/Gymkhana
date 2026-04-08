const express = require('express')
const crypto = require('crypto')
const pool = require('../config/db')

const router = express.Router()

function safeCompare(a, b) {
    const aBuf = Buffer.from(a)
    const bBuf = Buffer.from(b)
    if (aBuf.length !== bBuf.length) return false
    return crypto.timingSafeEqual(aBuf, bBuf)
}

function verifySvixSignature(payload, headers, webhookSecret) {
    const svixId = headers['svix-id']
    const svixTimestamp = headers['svix-timestamp']
    const svixSignature = headers['svix-signature']

    if (!svixId || !svixTimestamp || !svixSignature) return false

    const timestampNum = Number(svixTimestamp)
    if (!Number.isFinite(timestampNum)) return false

    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - timestampNum) > 5 * 60) return false

    const secretPart = webhookSecret.startsWith('whsec_')
        ? webhookSecret.slice(6)
        : webhookSecret

    const secret = Buffer.from(secretPart, 'base64')
    const signedContent = `${svixId}.${svixTimestamp}.${payload}`
    const expected = crypto
        .createHmac('sha256', secret)
        .update(signedContent)
        .digest('base64')

    const signatures = []
    const matches = svixSignature.matchAll(/v1,([^\s,]+)/g)
    for (const m of matches) signatures.push(m[1])
        

    return signatures.some(digest => safeCompare(digest, expected))
}

function resolveEmailFromClerkUser(data) {
    const emails = Array.isArray(data.email_addresses) ? data.email_addresses : []
    if (!emails.length) return null

    if (data.primary_email_address_id) {
        const primary = emails.find(e => e.id === data.primary_email_address_id)
        if (primary?.email_address) return primary.email_address
    }

    return emails[0]?.email_address || null
}

router.post('/', express.raw({ type: 'application/json' }), async (req, res, next) => {
    try {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
        if (!webhookSecret) {
            return res.status(500).json({ error: 'CLERK_WEBHOOK_SECRET is missing.' })
        }

        const payload = req.body.toString('utf8')

        if (!verifySvixSignature(payload, req.headers, webhookSecret)) {
            return res.status(401).json({ error: 'Invalid Clerk webhook signature.' })
        }

        const event = JSON.parse(payload)
        const type = event.type
        const data = event.data || {}

        if (type === 'user.created' || type === 'user.updated') {
            const userId = data.id
            const email = resolveEmailFromClerkUser(data)
            if (!userId || !email) {
                return res.status(400).json({ error: 'Missing user id or email in webhook payload.' })
            }

            let initialRole = 'student'
            if (email === '202451019@iiitvadodara.ac.in') initialRole = 'admin'

            await pool.query(
                `INSERT INTO users (id, email, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           email      = VALUES(email),
           first_name = VALUES(first_name),
           last_name  = VALUES(last_name)`,
                [
                    userId,
                    email,
                    data.first_name || '',
                    data.last_name || '',
                    initialRole,
                ]
            )
        }

        if (type === 'user.deleted') {
            const userId = data.id
            if (userId) {
                await pool.query('DELETE FROM users WHERE id = ?', [userId])
            }
        }

        return res.status(200).json({ ok: true })
    } catch (err) {
        next(err)
    }
})

module.exports = router
