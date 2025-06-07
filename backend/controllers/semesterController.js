// controllers/semesterController.js
const pool = require("../db");

exports.getAllSemesters = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM semesters ORDER BY semester_id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching semesters:", err.message);
    res.status(500).send("Server error");
  }
};

exports.getSemesterById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM semesters WHERE semester_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Semester not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching semester:", err.message);
    res.status(500).send("Server error");
  }
};

exports.addSemester = async (req, res) => {
  const { semester_name, year } = req.body;
  try {
    await pool.query(
      "INSERT INTO semesters (semester_name, year) VALUES ($1, $2)",
      [semester_name, year]
    );
    res.send("Semester added successfully");
  } catch (err) {
    console.error("Error adding semester:", err.message);
    res.status(500).send("Server error");
  }
};

exports.updateSemester = async (req, res) => {
  const { id } = req.params;
  const { semester_name, year } = req.body;
  try {
    const result = await pool.query(
      "UPDATE semesters SET semester_name = $1, year = $2 WHERE semester_id = $3",
      [semester_name, year, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Semester not found" });
    }

    res.status(200).json({ message: "Semester updated successfully" }); 
  } catch (err) {
    console.error("Error updating semester:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


exports.deleteSemester = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM semesters WHERE semester_id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).send("Semester not found");
    res.send("Semester deleted successfully");
  } catch (err) {
    console.error("Error deleting semester:", err.message);
    res.status(500).send("Server error");
  }
};
