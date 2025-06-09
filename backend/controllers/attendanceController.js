const pool = require('../db');

// Get all attendance
exports.getAllAttendance = async (req, res) => {
  function formatDateLocal(date) {
    const d = new Date(date);
    const offsetMs = d.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(d.getTime() - offsetMs);
    return localDate.toISOString().split('T')[0];
  }

  try {
    const result = await pool.query('SELECT * FROM attendance');
    const formatted = result.rows.map(att => ({
      ...att,
      date: formatDateLocal(att.date)
    }));
   res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a specific attendance record
exports.getAttendance = async (req, res) => {
  const { student_id, course_code, semester_id, date } = req.params;

  function formatDateLocal(date) {
    const d = new Date(date);
    const offsetMs = d.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(d.getTime() - offsetMs);
    return localDate.toISOString().split('T')[0];
  }

  try {
    const result = await pool.query(
      `SELECT * FROM attendance 
       WHERE student_id = $1 AND course_code = $2 AND semester_id = $3 AND date = $4`,
      [student_id, course_code, semester_id, date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    const attendance = result.rows[0];
    attendance.date = formatDateLocal(attendance.date);

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add a new attendance record
exports.createAttendance = async (req, res) => {
  const { student_id, course_code, semester_id, date, status } = req.body;
  try {
    await pool.query(
      `INSERT INTO attendance (student_id, course_code, semester_id, date, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [student_id, course_code, semester_id, date, status]
    );
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an attendance record
exports.updateAttendance = async (req, res) => {
  const { student_id, course_code, semester_id, date } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE attendance SET status = $5
       WHERE student_id = $1 AND course_code = $2 AND semester_id = $3 AND date = $4`,
      [student_id, course_code, semester_id, date, status]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Attendance record not found or not updated' });
    }
    res.json({ message: 'Attendance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an attendance record
exports.deleteAttendance = async (req, res) => {
  const { student_id, course_code, semester_id, date } = req.params;

  try {
    await pool.query(
      `DELETE FROM attendance
       WHERE student_id = $1 AND course_code = $2 AND semester_id = $3 AND date = $4`,
      [student_id, course_code, semester_id, date]
    );
    res.json({ message: 'Attendance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
