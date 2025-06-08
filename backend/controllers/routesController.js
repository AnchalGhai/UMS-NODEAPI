const pool = require('../db');

// 1. Students per department
exports.getStudentsPerDepartment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.department_name, COUNT(s.student_id) AS student_count
      FROM departments d
      LEFT JOIN students s ON d.dept_id = s.department_id
      GROUP BY d.department_name
      ORDER BY d.department_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Professors per department
exports.getProfessorsPerDepartment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.department_name, COUNT(p.professor_id) AS professor_count
      FROM departments d
      LEFT JOIN professors p ON d.dept_id = p.department_id
      GROUP BY d.department_name
      ORDER BY d.department_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Courses per department
exports.getCoursesPerDepartment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.department_name, COUNT(c.course_code) AS course_count
      FROM departments d
      LEFT JOIN courses c ON d.dept_id = c.department_id
      GROUP BY d.department_name
      ORDER BY d.department_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Courses or enrollments per semester
exports.getEnrollmentsPerSemester = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.semester_name, s.year, COUNT(e.course_code) AS enrollment_count
      FROM semesters s
      LEFT JOIN enrollments e ON s.semester_id = e.semester_id
      GROUP BY s.semester_name, s.year
      ORDER BY s.year, s.semester_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Schedules per classroom
exports.getSchedulesPerClassroom = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cl.classroom_id, COUNT(s.course_code) AS schedule_count
      FROM classrooms cl
      LEFT JOIN schedules s ON cl.classroom_id = s.classroom_id
      GROUP BY cl.classroom_id
      ORDER BY cl.classroom_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Classes per day of the week
exports.getSchedulesPerDay = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT day_of_week, COUNT(*) AS class_count
      FROM schedules
      GROUP BY day_of_week
      ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Grade distribution
exports.getGradeDistribution = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT grade, COUNT(*) AS grade_count
      FROM grades
      GROUP BY grade
      ORDER BY grade
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Enrollments per semester
exports.getEnrollmentsSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.semester_name, s.year, COUNT(e.student_id) AS total_enrollments
      FROM semesters s
      LEFT JOIN enrollments e ON s.semester_id = e.semester_id
      GROUP BY s.semester_name, s.year
      ORDER BY s.year, s.semester_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Attendance summary
exports.getAttendanceSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM attendance
      GROUP BY status
      ORDER BY status
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
