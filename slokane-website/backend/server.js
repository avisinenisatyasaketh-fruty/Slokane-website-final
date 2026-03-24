/**
 * SlokaNE Backend Server v2.0
 * Express + MySQL + JWT + Orders + SMS
 *
 * Setup:
 *  1. Edit backend/.env with MySQL credentials
 *  2. Add FAST2SMS_KEY to .env for SMS (optional but recommended)
 *  3. Run schema.sql in MySQL Workbench
 *  4. npm install && npm run dev
 */

require('dotenv').config();
require('./db');

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const authRouter    = require('./routes/auth');
const contactRouter = require('./routes/contact');
const ordersRouter  = require('./routes/orders');
const adminRouter   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false
    : ['http://localhost:5173', 'http://localhost:10000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',    authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/orders',  ordersRouter);
app.use('/api/admin',   adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ success:true, status:'OK', database:'MySQL', uptime:process.uptime().toFixed(1)+'s' });
});

// Serve React build in production
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (_, res) => res.sendFile(path.join(publicDir, 'index.html')));
}

app.listen(PORT, () => {
  const L = (s) => `  ║  ${(s||'').padEnd(48)}║`;
  console.log('\n  ╔══════════════════════════════════════════════════╗');
  console.log(L('SlokaNE Backend v2.0'));
  console.log(L(`http://localhost:${PORT}`));
  console.log(L(`DB: ${process.env.DB_HOST||'localhost'}/${process.env.DB_NAME||'slokane_db'}`));
  console.log(L(`SMS: ${process.env.FAST2SMS_KEY ? '✅ Fast2SMS configured' : '⚠️  No SMS key (set FAST2SMS_KEY)'}`));
  console.log('  ╠══════════════════════════════════════════════════╣');
  console.log(L('ROUTES'));
  console.log(L('  POST  /api/auth/signup'));
  console.log(L('  POST  /api/auth/signin'));
  console.log(L('  GET   /api/auth/me'));
  console.log(L('  PUT   /api/auth/profile'));
  console.log(L('  POST  /api/orders          (auth required)'));
  console.log(L('  GET   /api/orders/my        (auth required)'));
  console.log(L('  PATCH /api/orders/:id/cancel (auth required)'));
  console.log(L('  POST  /api/contact'));
  console.log(L('  POST  /api/contact/subscribe'));
  console.log(L('  GET   /api/admin/*          (x-api-key)'));
  console.log('  ╚══════════════════════════════════════════════════╝\n');
});

module.exports = app;
