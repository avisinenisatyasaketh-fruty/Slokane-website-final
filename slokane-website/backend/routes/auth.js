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

module.exports = router;