/**
 * test-db.js — MySQL Connection Diagnostic
 * Run from backend folder: node test-db.js
 * This will tell you EXACTLY what is wrong.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'slokane_db',
};

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[1m', X = '\x1b[0m';

console.log(`\n${B}SlokaNE — MySQL Connection Test${X}`);
console.log('─'.repeat(40));
console.log(`Host     : ${config.host}`);
console.log(`Port     : ${config.port}`);
console.log(`User     : ${config.user}`);
console.log(`Password : ${config.password ? '***' + config.password.slice(-2) : '(empty)'}`);
console.log(`Database : ${config.database}`);
console.log('─'.repeat(40));

async function test() {

  // ── Test 1: Connect WITHOUT specifying database ──────────────────────
  console.log(`\n${B}Test 1${X}: Connecting to MySQL server (no database)...`);
  let conn;
  try {
    conn = await mysql.createConnection({
      host:     config.host,
      port:     config.port,
      user:     config.user,
      password: config.password,
    });
    console.log(`${G}✅ SUCCESS — MySQL server is reachable!${X}`);
  } catch (err) {
    console.log(`${R}❌ FAILED — Cannot reach MySQL server${X}`);
    console.log(`   Error code : ${err.code}`);
    console.log(`   Message    : ${err.message}`);

    if (err.code === 'ECONNREFUSED') {
      console.log(`\n${Y}→ FIX: MySQL Server is not running.${X}`);
      console.log(`   Press Win+R → type "services.msc" → find MySQL80 → click Start`);
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log(`\n${Y}→ FIX: Wrong username or password in .env${X}`);
      console.log(`   Check DB_USER and DB_PASSWORD in backend/.env`);
    } else if (err.code === 'ENOTFOUND') {
      console.log(`\n${Y}→ FIX: DB_HOST is wrong. Change it to 'localhost' or '127.0.0.1'${X}`);
    }
    process.exit(1);
  }

  // ── Test 2: Check database exists ────────────────────────────────────
  console.log(`\n${B}Test 2${X}: Checking if database '${config.database}' exists...`);
  try {
    const [rows] = await conn.execute(
      `SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [config.database]
    );
    if (rows.length === 0) {
      console.log(`${R}❌ Database '${config.database}' does NOT exist${X}`);
      console.log(`\n${Y}→ FIX: Create the database by running schema.sql${X}`);
      console.log(`   In MySQL Workbench: File → Open SQL Script → schema.sql → Execute`);
      console.log(`\n   Creating it now automatically...`);
      await conn.execute(
        `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      console.log(`${G}✅ Database '${config.database}' created!${X}`);
      console.log(`${Y}   Now run schema.sql in MySQL Workbench to create the tables.${X}`);
    } else {
      console.log(`${G}✅ Database '${config.database}' exists!${X}`);
    }
  } catch (err) {
    console.log(`${R}❌ Error checking database: ${err.message}${X}`);
  }

  // ── Test 3: Connect with database ────────────────────────────────────
  console.log(`\n${B}Test 3${X}: Connecting with database '${config.database}'...`);
  try {
    await conn.execute(`USE \`${config.database}\``);
    console.log(`${G}✅ Connected to '${config.database}' successfully!${X}`);
  } catch (err) {
    console.log(`${R}❌ Cannot use database: ${err.message}${X}`);
    process.exit(1);
  }

  // ── Test 4: Check tables ──────────────────────────────────────────────
  console.log(`\n${B}Test 4${X}: Checking tables...`);
  try {
    const [tables] = await conn.execute('SHOW TABLES');
    const names = tables.map(t => Object.values(t)[0]);
    const required = ['users', 'contacts', 'subscribers'];

    required.forEach(t => {
      if (names.includes(t)) {
        console.log(`${G}  ✅ Table '${t}' exists${X}`);
      } else {
        console.log(`${R}  ❌ Table '${t}' is MISSING${X}`);
        console.log(`${Y}     → Run schema.sql in MySQL Workbench to create tables${X}`);
      }
    });
  } catch (err) {
    console.log(`${R}❌ Cannot check tables: ${err.message}${X}`);
  }

  await conn.end();

  // ── Summary ───────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`${G}${B}✅ All tests passed! Your .env is correct.${X}`);
  console.log(`   Now run: npm run dev\n`);
}

test().catch(err => {
  console.error(`\n${R}Unexpected error: ${err.message}${X}\n`);
  process.exit(1);
});
