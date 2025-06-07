const pool = require('../db');

// Get all grades
exports.getAllGrades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grades');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching grades:', err.message);
    res.status(500).send('Server error');
  }
};

// Get one grade by composite key
exports.getGrade = async (req, res) => {
  const { student_id, course_code, semester_id } = req.params;
  try {
    const query = `
      SELECT * FROM grades
      WHERE student_id = $1 AND course_code = $2 AND semester_id = $3
    `;
    const values = [student_id, course_code, semester_id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send('Grade not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching grade:', err.message);
    res.status(500).send('Server error');
  }
};

// Create a new grade
exports.createGrade = async (req, res) => {
  const { student_id, course_code, semester_id, grade } = req.body;
  try {
    const query = `
      INSERT INTO grades (student_id, course_code, semester_id, grade)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [student_id, course_code, semester_id, grade];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating grade:', err.message);
    res.status(500).send('Server error');
  }
};

// Update grade value only
exports.updateGrade = async (req, res) => {
  const { student_id, course_code, semester_id } = req.params;
  const { grade } = req.body;

  try {
    const query = `
      UPDATE grades
      SET grade = $1
      WHERE student_id = $2 AND course_code = $3 AND semester_id = $4
      RETURNING *
    `;
    const values = [grade, student_id, course_code, semester_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Grade not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating grade:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
  const { student_id, course_code, semester_id } = req.params;

  try {
    const query = `
      DELETE FROM grades
      WHERE student_id = $1 AND course_code = $2 AND semester_id = $3
    `;
    const values = [student_id, course_code, semester_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Grade not found');
    }

    res.send('Grade deleted successfully');
  } catch (err) {
    console.error('Error deleting grade:', err.message);
    res.status(500).send('Server error');
  }
};
