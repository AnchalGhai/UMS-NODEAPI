const pool = require('../db');

// Create a new course
exports.createCourse = async (req, res) => {
  const { course_code, course_name, credits, department_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO courses (course_code, course_name, credits, department_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [course_code, course_name, credits, department_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY course_code');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get course by course_code
exports.getCourseByCode = async (req, res) => {
  const { course_code } = req.params;
  try {
    const result = await pool.query('SELECT * FROM courses WHERE course_code = $1', [course_code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Update course by course_code
exports.updateCourse = async (req, res) => {
  const { course_code } = req.params;
  const { course_name, credits, department_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE courses SET course_name = $1, credits = $2, department_id = $3
       WHERE course_code = $4 RETURNING *`,
      [course_name, credits, department_id || null, course_code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete course by course_code
exports.deleteCourse = async (req, res) => {
  const { course_code } = req.params;
  try {
    const result = await pool.query('DELETE FROM courses WHERE course_code = $1 RETURNING *', [course_code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
