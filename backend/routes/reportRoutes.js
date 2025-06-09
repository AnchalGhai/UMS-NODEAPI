const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/students', reportController.getStudentCountPerDepartment);
router.get('/professors', reportController.getProfessorCountPerDepartment);
router.get('/courses', reportController.getCourseCountPerDepartment);
router.get('/enrollments-per-semester', reportController.getEnrollmentsPerSemester);
router.get('/schedules-per-classroom', reportController.getSchedulesPerClassroom);
router.get('/schedules-per-day', reportController.getSchedulesPerDay);
router.get('/grade-distribution', reportController.getGradeDistribution);
router.get('/attendance-summary', reportController.getAttendanceSummary);

module.exports = router;
