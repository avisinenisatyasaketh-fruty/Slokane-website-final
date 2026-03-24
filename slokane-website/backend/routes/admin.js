/**
 * routes/admin.js — Admin panel (x-api-key required)
 */

const express = require('express');
const pool    = require('../db');

const router    = express.Router();
const ADMIN_KEY = process.env.ADMIN_KEY || 'slokane-admin-2026';

function requireAdmin(req, res, next) {
  if (req.headers['x-api-key'] !== ADMIN_KEY)
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  next();
}

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [[{ tc }]]  = await pool.execute('SELECT COUNT(*) AS tc FROM contacts');
    const [[{ tnc }]] = await pool.execute("SELECT COUNT(*) AS tnc FROM contacts WHERE status='new'");
    const [[{ ts }]]  = await pool.execute('SELECT COUNT(*) AS ts FROM subscribers');
    const [[{ tu }]]  = await pool.execute('SELECT COUNT(*) AS tu FROM users');
    const [[{ to_ }]] = await pool.execute('SELECT COUNT(*) AS to_ FROM orders');
    const [[{ tp }]]  = await pool.execute("SELECT COUNT(*) AS tp FROM orders WHERE status='pending'");
    const [[{ rev }]] = await pool.execute("SELECT COALESCE(SUM(total_amount),0) AS rev FROM orders WHERE status NOT IN ('cancelled')");
    const [recent]    = await pool.execute('SELECT * FROM orders ORDER BY id DESC LIMIT 5');
    res.json({
      success: true,
      stats: {
        contacts: { total: tc, new: tnc },
        subscribers: ts, users: tu,
        orders: { total: to_, pending: tp, revenue: parseFloat(rev) },
      },
      recentOrders: recent,
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/contacts
router.get('/contacts', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY id DESC');
    res.json({ success: true, count: rows.length, contacts: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PATCH /api/admin/contacts/:id/status
router.patch('/contacts/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new','read','replied','closed'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
    await pool.execute('UPDATE contacts SET status=? WHERE id=?', [status, +req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /api/admin/contacts/:id
router.delete('/contacts/:id', requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM contacts WHERE id=?', [+req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/subscribers
router.get('/subscribers', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM subscribers ORDER BY id DESC');
    res.json({ success: true, count: rows.length, subscribers: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id,name,email,phone,created_at FROM users ORDER BY id DESC');
    res.json({ success: true, count: rows.length, users: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/admin/orders
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT o.*, u.name AS user_name FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC`);
    res.json({ success: true, count: rows.length, orders: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','confirmed','processing','shipped','delivered','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
    await pool.execute('UPDATE orders SET status=? WHERE id=?', [status, +req.params.id]);

    // Get order to send SMS
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id=?', [+req.params.id]);
    if (rows.length > 0) {
      const o = rows[0];
      const msgs = {
        confirmed:  `Dear ${o.customer_name}, your SlokaNE order ${o.tracking_id} is confirmed! We are preparing it for dispatch. - SlokaNE`,
        processing: `Dear ${o.customer_name}, your SlokaNE order ${o.tracking_id} is being processed and packed. - SlokaNE`,
        shipped:    `Dear ${o.customer_name}, great news! Your order ${o.tracking_id} has been shipped. Expected delivery: 3-5 business days. - SlokaNE`,
        delivered:  `Dear ${o.customer_name}, your SlokaNE order ${o.tracking_id} has been delivered. Thank you for shopping with us! - SlokaNE`,
        cancelled:  `Dear ${o.customer_name}, your SlokaNE order ${o.tracking_id} has been cancelled. Contact us for support. - SlokaNE`,
      };
      if (msgs[status]) {
        const apiKey = process.env.FAST2SMS_KEY;
        if (apiKey) {
          await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: { authorization: apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ route:'q', message:msgs[status], language:'english', flash:0, numbers:o.customer_phone }),
          }).catch(() => {});
        }
        console.log(`📱  [SMS] Order #${o.id} → ${status} | To: ${o.customer_phone}`);
      }
    }
    res.json({ success: true, message: `Order status updated to "${status}".` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
