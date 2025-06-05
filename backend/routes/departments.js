const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new department
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO departments (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
