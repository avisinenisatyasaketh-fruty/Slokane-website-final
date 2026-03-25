const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  connection.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ success: false, message: "DB error" });
      }

      res.json({ success: true, message: "User created" });
    }
  );
});
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {

      if (err) {
        return res.status(500).json({ success: false, message: "DB error" });
      }

      // user not found
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      const user = results[0];

      // check password
      if (user.password !== password) {
        return res.status(401).json({ success: false, message: "Wrong password" });
      }

      // success
      res.json({ success: true, message: "Login success" });
    }
  );
});

module.exports = router;