const pool = require('../db');

exports.createStudent = async (req, res) => {
  try {
    const { name, email, department_id } = req.body;
    const result = await pool.query(
      'INSERT INTO students (name, email, department_id) VALUES ($1, $2, $3) RETURNING *',
      [name, email, department_id]
    );
    res.status(201).json({ message: "Student created", student: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE student_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department_id } = req.body;
    const result = await pool.query(
      'UPDATE students SET name=$1, email=$2, department_id=$3 WHERE student_id=$4 RETURNING *',
      [name, email, department_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student updated", student: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM students WHERE student_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






