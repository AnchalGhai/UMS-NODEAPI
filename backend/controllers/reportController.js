const pool = require('../db');

// 1. Students per Department
exports.getStudentCountPerDepartment = async (req, res) => {
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
    console.error('Error fetching student report:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. Professors per Department
exports.getProfessorCountPerDepartment = async (req, res) => {
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
    console.error('Error fetching professor report:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 3. Courses per Department
exports.getCourseCountPerDepartment = async (req, res) => {
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
    console.error('Error fetching course report:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 4. Enrollments per Semester
exports.getEnrollmentsPerSemester = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sem.semester_name, COUNT(*) AS enrollment_count
      FROM semesters sem
      LEFT JOIN enrollments e ON sem.semester_id = e.semester_id
      GROUP BY sem.semester_name
      ORDER BY sem.semester_name;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching enrollments per semester:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 5. Schedules per Classroom
exports.getSchedulesPerClassroom = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.room_number, COUNT(*) AS schedule_count
      FROM classrooms c
      LEFT JOIN schedules s ON c.classroom_id = s.classroom_id
      GROUP BY c.room_number
      ORDER BY c.room_number;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching schedules per classroom:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 6. Classes per Day of Week
exports.getSchedulesPerDay = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT day_of_week, COUNT(*) AS class_count
      FROM schedules
      GROUP BY day_of_week
      ORDER BY day_of_week
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching schedules per day:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 7. Grade Distribution
exports.getGradeDistribution = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT grade, COUNT(*) AS count
      FROM grades
      GROUP BY grade
      ORDER BY grade
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching grade distribution:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 8. Attendance Summary
exports.getAttendanceSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) AS late
      FROM attendance
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching attendance summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
