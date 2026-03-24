const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');

const router     = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'slokane-secret-2026';
const emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token.' });
  try { req.user = jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { return res.status(401).json({ success: false, message: 'Token expired.' }); }
}

router.post('/signup', async (req, res) => {
  try {
    const { name='', email='', phone='', password='' } = req.body||{};
    if (!name.trim()) return res.status(400).json({ success:false, message:'Name is required.' });
    if (!emailRe.test(email)) return res.status(400).json({ success:false, message:'Invalid email.' });
    if (password.length < 6) return res.status(400).json({ success:false, message:'Password must be 6+ characters.' });
    const [ex] = await pool.execute('SELECT id FROM users WHERE email=?', [email.toLowerCase().trim()]);
    if (ex.length>0) return res.status(409).json({ success:false, message:'Email already registered.' });
    const hash = await bcrypt.hash(password, 12);
    const [r] = await pool.execute('INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)', [name.trim(), email.toLowerCase().trim(), phone.trim(), hash]);
    const token = jwt.sign({ id:r.insertId, email:email.toLowerCase().trim() }, JWT_SECRET, { expiresIn:'7d' });
    console.log(`✅  [MySQL] New user: ${email} id=${r.insertId}`);
    return res.status(201).json({ success:true, token, user:{ id:r.insertId, name:name.trim(), email:email.toLowerCase().trim(), phone:phone.trim() } });
  } catch(err) { console.error('[signup]',err.message); return res.status(500).json({ success:false, message:'Server error.' }); }
});

router.post('/signin', async (req, res) => {
  try {
    const { email='', password='' } = req.body||{};
    if (!email.trim()||!password) return res.status(400).json({ success:false, message:'Email and password required.' });
    const [rows] = await pool.execute('SELECT * FROM users WHERE email=?', [email.toLowerCase().trim()]);
    if (!rows.length) return res.status(401).json({ success:false, message:'No account with this email.' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success:false, message:'Incorrect password.' });
    const token = jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn:'7d' });
    console.log(`🔓  [MySQL] Sign in: ${user.email}`);
    return res.json({ success:true, token, user:{ id:user.id, name:user.name, email:user.email, phone:user.phone } });
  } catch(err) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id,name,email,phone,created_at FROM users WHERE id=?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ success:false, message:'User not found.' });
    return res.json({ success:true, user:rows[0] });
  } catch(err) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name='', phone='' } = req.body||{};
    if (!name.trim()) return res.status(400).json({ success:false, message:'Name is required.' });
    await pool.execute('UPDATE users SET name=?,phone=? WHERE id=?', [name.trim(), phone.trim(), req.user.id]);
    return res.json({ success:true, message:'Profile updated successfully.' });
  } catch(err) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

module.exports = router;
