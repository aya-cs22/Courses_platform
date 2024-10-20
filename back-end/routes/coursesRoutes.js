const express = require('express');
const router = express.Router();
const Courses = require('../models/courses');
const coursesController = require('../controllers/coursesController');
const authMiddleware = require('../middleware/authenticate')
router.post('/', authMiddleware, coursesController.creatCourse);
router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getAllCourses);

router.put('/:id', authMiddleware, coursesController.updateCourseById);
router.delete('/:id', authMiddleware, coursesController.deleteCourseById);

module.exports = router;
