/**
 * view-db.js — CLI viewer for MySQL database
 * Usage (from backend/ folder):
 *   node view-db.js               → summary
 *   node view-db.js users         → all users
 *   node view-db.js contacts      → all contacts
 *   node view-db.js orders        → all orders
 *   node view-db.js subscribers   → all subscribers
 *   node view-db.js orders pending → orders with status=pending
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const B='\x1b[1m', R='\x1b[0m', C='\x1b[36m', G='\x1b[32m', Y='\x1b[33m', RED='\x1b[31m';

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST||'localhost', port: process.env.DB_PORT||3306,
      user: process.env.DB_USER||'root', password: process.env.DB_PASSWORD||'',
      database: process.env.DB_NAME||'slokane_db',
    });
  } catch(e) {
    console.error(`\n${RED}❌  MySQL connect failed: ${e.message}${R}`);
    console.error(`${Y}   Check backend/.env credentials${R}\n`);
    process.exit(1);
  }

  const [,, table, filter] = process.argv;

  try {
    if (!table) {
      const [[{tu}]] = await conn.execute('SELECT COUNT(*) AS tu FROM users');
      const [[{tc}]] = await conn.execute('SELECT COUNT(*) AS tc FROM contacts');
      const [[{tn}]] = await conn.execute("SELECT COUNT(*) AS tn FROM contacts WHERE status='new'");
      const [[{ts}]] = await conn.execute('SELECT COUNT(*) AS ts FROM subscribers');
      const [[{to_}]]= await conn.execute('SELECT COUNT(*) AS to_ FROM orders');
      const [[{tp}]] = await conn.execute("SELECT COUNT(*) AS tp FROM orders WHERE status='pending'");
      const [[{rev}]]= await conn.execute("SELECT COALESCE(SUM(total_amount),0) AS rev FROM orders WHERE status != 'cancelled'");

      console.log(`\n${B}${G}╔══════════════════════════════════════╗`);
      console.log(`║     SlokaNE — MySQL Summary          ║`);
      console.log(`╚══════════════════════════════════════╝${R}`);
      console.log(`  🗄️  Database    : ${process.env.DB_NAME||'slokane_db'}`);
      console.log(`  👤 Users       : ${B}${tu}${R}`);
      console.log(`  📩 Contacts    : ${B}${tc}${R}  (${Y}${tn} new${R})`);
      console.log(`  🔔 Subscribers : ${B}${ts}${R}`);
      console.log(`  🛒 Orders      : ${B}${to_}${R}  (${Y}${tp} pending${R})`);
      console.log(`  💰 Revenue     : ${B}₹${parseFloat(rev).toFixed(2)}${R}`);
      console.log(`\n  ${C}node view-db.js users${R}`);
      console.log(`  ${C}node view-db.js orders${R}`);
      console.log(`  ${C}node view-db.js orders pending${R}`);
      console.log(`  ${C}node view-db.js contacts${R}`);
      console.log(`  ${C}node view-db.js subscribers${R}\n`);

    } else if (table === 'users') {
      const [rows] = await conn.execute('SELECT id,name,email,phone,created_at FROM users ORDER BY id DESC');
      console.log(`\n${B}${C}━━━  USERS (${rows.length})  ━━━${R}`);
      rows.length ? console.table(rows) : console.log('  (empty)');

    } else if (table === 'contacts') {
      const sql  = filter ? 'SELECT * FROM contacts WHERE status=? ORDER BY id DESC' : 'SELECT * FROM contacts ORDER BY id DESC';
      const args = filter ? [filter] : [];
      const [rows] = await conn.execute(sql, args);
      console.log(`\n${B}${C}━━━  CONTACTS${filter?` (${filter})`:''} (${rows.length})  ━━━${R}`);
      rows.length ? console.table(rows) : console.log('  (empty)');

    } else if (table === 'orders') {
      const sql  = filter ? 'SELECT * FROM orders WHERE status=? ORDER BY id DESC' : 'SELECT * FROM orders ORDER BY id DESC';
      const args = filter ? [filter] : [];
      const [rows] = await conn.execute(sql, args);
      console.log(`\n${B}${C}━━━  ORDERS${filter?` (${filter})`:''} (${rows.length})  ━━━${R}`);
      rows.length ? console.table(rows) : console.log('  (empty)');

    } else if (table === 'subscribers') {
      const [rows] = await conn.execute('SELECT * FROM subscribers ORDER BY id DESC');
      console.log(`\n${B}${C}━━━  SUBSCRIBERS (${rows.length})  ━━━${R}`);
      rows.length ? console.table(rows) : console.log('  (empty)');

    } else {
      console.error(`\n${RED}Unknown: "${table}". Use: users | contacts | orders | subscribers${R}\n`);
    }
  } finally {
    await conn.end();
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
