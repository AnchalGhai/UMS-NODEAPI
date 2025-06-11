
const pool = require('../db');


exports.getAllProfessors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.professor_id, p.name, p.email, d.department_name
      FROM professors p
      LEFT JOIN departments d ON p.department_id = d.dept_id
      ORDER BY p.professor_id
    `);
    res.json(result.rows);
  
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM professors WHERE professor_id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).send('Professor not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.addProfessor = async (req, res) => {
  try {
    const { name, email, department_id } = req.body;
    const result = await pool.query(
      `INSERT INTO professors (name, email, department_id) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, department_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).send('Email already exists');
    res.status(500).send('Server error');
  }
};


exports.updateProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department_id } = req.body;
    const result = await pool.query(
      `UPDATE professors SET name = $1, email = $2, department_id = $3 WHERE professor_id = $4 RETURNING *`,
      [name, email, department_id, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Professor not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).send('Email already exists');
    res.status(500).send('Server error');
  }
};


exports.deleteProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM professors WHERE professor_id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).send('Professor not found');
    res.send('Professor deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


