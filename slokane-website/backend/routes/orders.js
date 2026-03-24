/**
 * routes/orders.js
 *
 * POST /api/orders          → Place a new order (auth required)
 * GET  /api/orders/my       → Get current user's orders (auth required)
 * GET  /api/orders/:id      → Get single order detail (auth required)
 * PATCH /api/orders/:id/cancel → Cancel order (auth required)
 *
 * SMS Notification via Fast2SMS (free Indian SMS API)
 * Sign up free at https://www.fast2sms.com to get API key
 * Set FAST2SMS_KEY in backend/.env
 */

const express = require('express');
const pool    = require('../db');

const router = express.Router();

// ── JWT Auth Middleware ────────────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'slokane-secret-2026';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  }
}

// ── SMS Helper ─────────────────────────────────────────────────────────────
async function sendSMS(phone, message) {
  const apiKey = process.env.FAST2SMS_KEY;
  if (!apiKey) {
    console.log(`📱  [SMS SKIPPED — no FAST2SMS_KEY] To: ${phone} | Msg: ${message}`);
    return { success: true, skipped: true };
  }
  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route:    'q',
        message:  message,
        language: 'english',
        flash:    0,
        numbers:  phone,
      }),
    });
    const data = await res.json();
    if (data.return) {
      console.log(`📱  [SMS SENT] To: ${phone}`);
      return { success: true };
    }
    console.warn(`📱  [SMS FAILED]`, data);
    return { success: false };
  } catch (err) {
    console.error(`📱  [SMS ERROR]`, err.message);
    return { success: false };
  }
}

// Generate a tracking ID
function genTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'SNE';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// ─────────────────────────────────────────────────────────────────────────
// POST /api/orders — Place new order
// ─────────────────────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      product_name, variant = '', quantity = 1, price,
      customer_name, customer_email, customer_phone,
      address, city, pincode, notes = ''
    } = req.body;

    // Validation
    if (!product_name || !price || !customer_name || !customer_phone || !address || !city || !pincode)
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    if (!/^[6-9]\d{9}$/.test(customer_phone))
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian mobile number.' });

    const total_amount = parseFloat(price) * parseInt(quantity);
    const tracking_id  = genTrackingId();

    const [result] = await pool.execute(
      `INSERT INTO orders
        (user_id, product_name, variant, quantity, price, total_amount,
         customer_name, customer_email, customer_phone,
         address, city, pincode, tracking_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, product_name, variant, parseInt(quantity),
        parseFloat(price), total_amount,
        customer_name.trim(), customer_email.trim(), customer_phone.trim(),
        address.trim(), city.trim(), pincode.trim(), tracking_id, notes.trim()
      ]
    );

    console.log(`🛒  [MySQL] Order placed → id=${result.insertId}, tracking=${tracking_id}, user=${req.user.id}`);

    // Send SMS notification
    const smsMsg = `Dear ${customer_name}, your SlokaNE order for ${product_name} (Qty: ${quantity}) has been placed successfully! Order ID: ${tracking_id}. Total: Rs.${total_amount}. We will notify you when it ships. - SlokaNE`;
    await sendSMS(customer_phone, smsMsg);

    return res.status(201).json({
      success:     true,
      orderId:     result.insertId,
      tracking_id,
      total_amount,
      message:     `Order placed successfully! Tracking ID: ${tracking_id}. An SMS has been sent to ${customer_phone}.`,
    });
  } catch (err) {
    console.error('[orders/place ERROR]', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// GET /api/orders/my — Get all orders for logged-in user
// ─────────────────────────────────────────────────────────────────────────
router.get('/my', requireAuth, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('[orders/my ERROR]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// GET /api/orders/:id — Get single order
// ─────────────────────────────────────────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [parseInt(req.params.id), req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.json({ success: true, order: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// PATCH /api/orders/:id/cancel — Cancel order (only if pending)
// ─────────────────────────────────────────────────────────────────────────
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [parseInt(req.params.id), req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Order not found.' });
    const order = rows[0];
    if (!['pending', 'confirmed'].includes(order.status))
      return res.status(400).json({ success: false, message: `Cannot cancel order in "${order.status}" status.` });

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', order.id]);

    // SMS notification for cancellation
    const smsMsg = `Dear ${order.customer_name}, your SlokaNE order ${order.tracking_id} has been cancelled. If this was a mistake, please contact us. - SlokaNE`;
    await sendSMS(order.customer_phone, smsMsg);

    console.log(`❌  [MySQL] Order #${order.id} cancelled`);
    return res.json({ success: true, message: 'Order cancelled successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
