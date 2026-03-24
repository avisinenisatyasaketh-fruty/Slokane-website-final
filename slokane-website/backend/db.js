const mysql = require('mysql2');

const dbUrl = new URL(process.env.DATABASE_URL);

const connection = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  port: Number(dbUrl.port),
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection FAILED:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

module.exports = connection;