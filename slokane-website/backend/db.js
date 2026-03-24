/**
 * db.js - MySQL connection pool using mysql2
 * Reads credentials from backend/.env via dotenv
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'slokane_prod_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 10000,
});

pool.getConnection()
  .then((conn) => {
    conn.release();
    console.log(`MySQL connected -> ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'slokane_prod_db'}`);
  })
  .catch((err) => {
    console.error('\nMySQL connection FAILED');
    console.error(`Code    : ${err.code}`);
    console.error(`Message : ${err.message}`);
    console.error('\nTROUBLESHOOT:');
    console.error('1. Run: node test-db.js');
    console.error('2. Check backend/.env credentials');
    console.error('3. Make sure MySQL Server is running');
    console.error('4. Run schema.sql or database_setup.sql in MySQL Workbench\n');
    process.exit(1);
  });

module.exports = pool;
