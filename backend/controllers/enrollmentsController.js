const pool = require('../db');

function formatDateToYYYYMMDD(date) {
  if (!date) return null;
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return `${year}-${month}-${day}`;
}

const formatEnrollment = (enrollment) => ({
  ...enrollment,
  enrollment_date: enrollment.enrollment_date.toISOString().split('T')[0]
});


exports.getAllEnrollments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enrollments');
    const formatted = result.rows.map(enrollment => ({
      ...enrollment,
      enrollment_date: formatDateToYYYYMMDD(enrollment.enrollment_date),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getEnrollment = async (req, res) => {
  const { student_id, course_code, semester_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_code = $2 AND semester_id = $3',
      [student_id, course_code, semester_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    const enrollment = result.rows[0];
    enrollment.enrollment_date = formatDateToYYYYMMDD(enrollment.enrollment_date);
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createEnrollment = async (req, res) => {
  const { student_id, course_code, semester_id, enrollment_date } = req.body;
  try {
    await pool.query(
      'INSERT INTO enrollments (student_id, course_code, semester_id, enrollment_date) VALUES ($1, $2, $3, $4)',
      [student_id, course_code, semester_id, enrollment_date || new Date()]
    );
    res.status(201).json({ message: 'Enrollment created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateEnrollment = async (req, res) => {
  const { student_id, course_code, semester_id } = req.params;
  const { enrollment_date } = req.body;

  try {
    console.log('Updating enrollment:', student_id, course_code, semester_id, enrollment_date);
    const result = await pool.query(
      `UPDATE enrollments
       SET enrollment_date = $4
       WHERE student_id = $1 AND course_code = $2 AND semester_id = $3`,
      [student_id, course_code, semester_id, enrollment_date]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Enrollment not found or not updated" });
    }

    res.json({ message: "Enrollment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteEnrollment = async (req, res) => {
  const { student_id, course_code, semester_id } = req.params;
  try {
    await pool.query(
      'DELETE FROM enrollments WHERE student_id = $1 AND course_code = $2 AND semester_id = $3',
      [student_id, course_code, semester_id]
    );
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
