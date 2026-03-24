/**
 * routes/contact.js
 * POST /api/contact           → INSERT into MySQL contacts table
 * POST /api/contact/subscribe → INSERT into MySQL subscribers table
 */

const express = require('express');
const pool    = require('../db');   // MySQL connection pool

const router  = express.Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────────────────────────────────
// POST /api/contact
// ─────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name = '', email = '', phone = '', service = '', message = '' } = req.body || {};

    if (!name.trim())          return res.status(400).json({ success: false, message: 'Name is required.' });
    if (!email.trim())         return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!message.trim())       return res.status(400).json({ success: false, message: 'Message is required.' });
    if (!emailRe.test(email))  return res.status(400).json({ success: false, message: 'Invalid email address.' });

    // INSERT into MySQL contacts table
    const [result] = await pool.execute(
      'INSERT INTO contacts (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), phone.trim(), service.trim(), message.trim()]
    );

    console.log(`\x1b[35m📩  [MySQL] Contact saved → id=${result.insertId}, name=${name}, service=${service || 'General'}\x1b[0m`);

    return res.json({
      success: true,
      id:      result.insertId,
      message: 'Your message has been received! We will contact you shortly.',
    });
  } catch (err) {
    console.error('[contact ERROR]', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/contact/subscribe
// ─────────────────────────────────────────────────────────────────────────
router.post('/subscribe', async (req, res) => {
  try {
    const { email = '', name = '' } = req.body || {};

    if (!email.trim())        return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!emailRe.test(email)) return res.status(400).json({ success: false, message: 'Invalid email address.' });

    // Check if already subscribed in MySQL
    const [existing] = await pool.execute(
      'SELECT id FROM subscribers WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    if (existing.length > 0)
      return res.json({ success: true, alreadyExists: true, message: "You're already subscribed!" });

    // INSERT into MySQL subscribers table
    const [result] = await pool.execute(
      'INSERT INTO subscribers (email, name) VALUES (?, ?)',
      [email.toLowerCase().trim(), name.trim()]
    );

    console.log(`\x1b[33m🔔  [MySQL] Subscriber saved → id=${result.insertId}, email=${email}\x1b[0m`);

    return res.json({ success: true, message: "Subscribed! We'll notify you when new products launch." });
  } catch (err) {
    console.error('[subscribe ERROR]', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
