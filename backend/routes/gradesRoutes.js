const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradesController');

router.get('/', gradeController.getAllGrades);
router.get('/:student_id/:course_code/:semester_id', gradeController.getGrade);
router.post('/', gradeController.createGrade);
router.put('/:student_id/:course_code/:semester_id', gradeController.updateGrade);
router.delete('/:student_id/:course_code/:semester_id', gradeController.deleteGrade);

module.exports = router;
