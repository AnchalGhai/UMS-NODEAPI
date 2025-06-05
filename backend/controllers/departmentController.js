const pool = require('../db');

// GET all departments
exports.getDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD department
exports.addDepartment = async (req, res) => {
  const { department_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO departments (department_name) VALUES ($1) RETURNING *',
      [department_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
