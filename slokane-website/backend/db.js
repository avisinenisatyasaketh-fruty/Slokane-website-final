const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   // ✅ FIXED
  database: process.env.DB_NAME,       // ✅ FIXED
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection FAILED:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

module.exports = connection;