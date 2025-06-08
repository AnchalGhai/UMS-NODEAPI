const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAllAttendance);
router.get('/:student_id/:course_code/:semester_id/:date', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
router.put('/:student_id/:course_code/:semester_id/:date', attendanceController.updateAttendance);
router.delete('/:student_id/:course_code/:semester_id/:date', attendanceController.deleteAttendance);

module.exports = router;
