const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getCourses);
router.get('/:course_code', courseController.getCourseByCode);
router.post('/', courseController.createCourse);
router.put('/:course_code', courseController.updateCourse);
router.delete('/:course_code', courseController.deleteCourse);

module.exports = router;
