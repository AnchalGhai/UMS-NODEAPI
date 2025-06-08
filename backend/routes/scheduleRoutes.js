const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllSchedules);
router.get('/:course_code/:professor_id/:semester_id/:day_of_week/:start_time', scheduleController.getSchedule);
router.post('/', scheduleController.createSchedule); 
router.put('/:course_code/:professor_id/:semester_id/:day_of_week/:start_time', scheduleController.updateSchedule);
router.delete('/:course_code/:professor_id/:semester_id/:day_of_week/:start_time', scheduleController.deleteSchedule);

module.exports = router;
