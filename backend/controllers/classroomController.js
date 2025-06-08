const pool = require('../db');

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classrooms');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching classrooms:', err.message);
    res.status(500).send('Server error');
  }
};

// Get single classroom by ID
exports.getClassroomById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM classrooms WHERE classroom_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Classroom not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching classroom:', err.message);
    res.status(500).send('Server error');
  }
};

// Add a new classroom
exports.addClassroom = async (req, res) => {
  const { classroom_id, building_name, room_number } = req.body;
  try {
    await pool.query(
      'INSERT INTO classrooms (classroom_id, building_name, room_number) VALUES ($1, $2, $3)',
      [classroom_id, building_name, room_number]
    );
    res.send('Classroom added successfully');
  } catch (err) {
    console.error('Error adding classroom:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a classroom
exports.updateClassroom = async (req, res) => {
  const { id } = req.params;
  const { building_name, room_number } = req.body;
  try {
    const result = await pool.query(
      'UPDATE classrooms SET building_name = $1, room_number = $2 WHERE classroom_id = $3',
      [building_name, room_number, id]
    );
    if (result.rowCount === 0){
        return res.status(404).json({error: 'Classroom Not Found '});
    } 
    res.status(200).json({ message: ' Classroom updated successfully' });
  } catch (err) {
    console.error('Error updating classroom:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete a classroom
exports.deleteClassroom = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM classrooms WHERE classroom_id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).send('Classroom not found');
    res.send('Classroom deleted successfully');
  } catch (err) {
    console.error('Error deleting classroom:', err.message);
    res.status(500).send('Server error');
  }
};
