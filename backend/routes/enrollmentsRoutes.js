const express = require('express');
const router = express.Router();
const enrollmentsController = require('../controllers/enrollmentsController');

router.get('/', enrollmentsController.getAllEnrollments);
router.get('/:student_id/:course_code/:semester_id', enrollmentsController.getEnrollment);
router.post('/', enrollmentsController.createEnrollment);
router.put('/:student_id/:course_code/:semester_id', enrollmentsController.updateEnrollment);
router.delete('/:student_id/:course_code/:semester_id', enrollmentsController.deleteEnrollment);

module.exports = router;
