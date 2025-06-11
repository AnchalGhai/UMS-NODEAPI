const pool = require('../db'); 

exports.getDepartments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM departments");

res.json(result.rows);

  } catch (error) {
    console.error("❌ Error in getDepartments:", error.message);
    res.status(500).json({ error: "Server error while fetching departments" });
  }
};



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


exports.updateDepartment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { department_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE departments SET department_name = $1 WHERE dept_id = $2 RETURNING *',
      [department_name, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department updated successfully", department: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteDepartment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      'DELETE FROM departments WHERE dept_id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getDepartmentById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      'SELECT * FROM departments WHERE dept_id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
