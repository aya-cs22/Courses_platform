const express = require('express');
const router = express.Router();
const Lectures = require('../models/lectures');
const lecturesController = require('../controllers/lecturesController.js');
const authMiddleware = require('../middleware/authenticate');

router.post('/', authMiddleware, lecturesController.creatLectures);
router.get('/', lecturesController.getAllLectures);

// Attendance
router.post('/attend', authMiddleware, lecturesController.attendLecture);
router.get('/attendance', authMiddleware, lecturesController.getUserAttendanceCount);

// Get lecture by ID
router.get('/:id', lecturesController.getLecturesById);
router.put('/:id', authMiddleware, lecturesController.updateLecturesById);
router.delete('/:id', authMiddleware, lecturesController.deleteLecturesById);
router.post('/:lectureId/createtasks', authMiddleware, lecturesController.createTask);
router.get('/:lectureId/tasks', lecturesController.getTasksByLectureId);

// Submit task
router.post('/:lectureId/tasks/:taskId/submit', authMiddleware, lecturesController.submitTask);

module.exports = router;