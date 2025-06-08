const pool = require('../db');

// CREATE Student
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

// GET All Students
exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Student by ID
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

// UPDATE Student
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

// DELETE Student
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

// ✅ Chart Data Controller
exports.getStudentCountPerDepartment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.name AS department_name, COUNT(s.student_id) AS student_count
      FROM departments d
      LEFT JOIN students s ON d.department_id = s.department_id
      GROUP BY d.name
      ORDER BY d.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
