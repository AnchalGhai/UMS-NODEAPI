const pool = require('../db'); // your PostgreSQL pool connection

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedules');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedules:', err.message);
    res.status(500).send('Server error');
  }
};

// Get schedule by composite key params
exports.getSchedule = async (req, res) => {
  const { course_code, professor_id, semester_id, day_of_week, start_time } = req.params;
  try {
    const query = `
      SELECT * FROM schedules
      WHERE course_code = $1 AND professor_id = $2 AND semester_id = $3
      AND day_of_week = $4 AND start_time = $5
    `;
    const values = [course_code, professor_id, semester_id, day_of_week, start_time];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send('Schedule not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching schedule:', err.message);
    res.status(500).send('Server error');
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  const { course_code, professor_id, classroom_id, semester_id, day_of_week, start_time, end_time } = req.body;

  try {
    const query = `
      INSERT INTO schedules (course_code, professor_id, classroom_id, semester_id, day_of_week, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [course_code, professor_id, classroom_id, semester_id, day_of_week, start_time, end_time];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating schedule:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a schedule (identified by composite key)
exports.updateSchedule = async (req, res) => {
  const { course_code, professor_id, semester_id, day_of_week, start_time } = req.params;
  const { classroom_id, end_time } = req.body;

  try {
    const query = `
      UPDATE schedules
      SET classroom_id = $1, end_time = $2
      WHERE course_code = $3 AND professor_id = $4 AND semester_id = $5
      AND day_of_week = $6 AND start_time = $7
      RETURNING *
    `;
    const values = [classroom_id, end_time, course_code, professor_id, semester_id, day_of_week, start_time];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Schedule not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating schedule:', err.message);
    res.status(500).send('Server error');
  }
};



// Delete a schedule (by composite key)
exports.deleteSchedule = async (req, res) => {
  const { course_code, professor_id, semester_id, day_of_week, start_time } = req.params;

  try {
    const query = `
      DELETE FROM schedules
      WHERE course_code = $1 AND professor_id = $2 AND semester_id = $3
      AND day_of_week = $4 AND start_time = $5
    `;
    const values = [course_code, professor_id, semester_id, day_of_week, start_time];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Schedule not found');
    }

    res.send('Schedule deleted successfully');
  } catch (err) {
    console.error('Error deleting schedule:', err.message);
    res.status(500).send('Server error');
  }
};
