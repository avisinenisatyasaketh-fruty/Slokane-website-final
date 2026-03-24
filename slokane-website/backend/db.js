const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection FAILED:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

module.exports = connection;