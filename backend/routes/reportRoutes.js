const express = require('express');
const router = express.Router();
const reportController = require('../controllers/routesController');

// Route 1: Students per department
router.get('/students-per-department', reportController.getStudentsPerDepartment);

// Route 2: Professors per department
router.get('/professors-per-department', reportController.getProfessorsPerDepartment);

// Route 3: Courses per department
router.get('/courses-per-department', reportController.getCoursesPerDepartment);

// Route 4: Enrollments per semester
router.get('/enrollments-per-semester', reportController.getEnrollmentsPerSemester);

// Route 5: Schedules per classroom
router.get('/schedules-per-classroom', reportController.getSchedulesPerClassroom);

// Route 6: Schedules per day of week
router.get('/schedules-per-day', reportController.getSchedulesPerDay);

// Route 7: Grade distribution
router.get('/grade-distribution', reportController.getGradeDistribution);

// Route 8: Enrollments summary
router.get('/enrollments-summary', reportController.getEnrollmentsSummary);

// Route 9: Attendance summary
router.get('/attendance-summary', reportController.getAttendanceSummary);

module.exports = router;
