const express = require('express');
const router = express.Router();
const lecture = require('../models/lectures');
const lecturesController = require('../controllers/lecturesController.js');
const authMiddleware = require('../middleware/authenticate')
router.post('/', authMiddleware, lecturesController.creatLectures);
router.get('/', lecturesController.getAllLectures);
// attend user
router.post('/attend', authMiddleware, lecturesController.attendLecture);
router.get('/attendance', authMiddleware, lecturesController.getUserAttendanceCount);
router.get('/:id', lecturesController.getLecturesById);
router.get('/:id', lecturesController.getLecturesById);
router.put('/:id', authMiddleware, lecturesController.updateLecturesById);
router.delete('/:id', authMiddleware, lecturesController.deleteLecturesById);
router.post('/:lectureId/createtasks', authMiddleware, lecturesController.createTask);

// router.get('/tasks/:id', lecturesController.getTaskById);

module.exports = router;