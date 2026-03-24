const mysql = require('mysql2');

const url = new URL(process.env.DATABASE_URL);

const connection = mysql.createConnection({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
  port: url.port,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection FAILED:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

module.exports = connection;