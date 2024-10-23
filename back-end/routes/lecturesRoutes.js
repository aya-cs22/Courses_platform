const express = require('express');
const router = express.Router();
const Lectures = require('../models/lectures');
const lecturesController = require('../controllers/lecturesController')
const authMiddleware = require('../middleware/authenticate')
router.post('/', authMiddleware, lecturesController.creatLectures);
router.post('/attend', authMiddleware, lecturesController.attendLecture);

router.get('/attendance', authMiddleware, lecturesController.getUserAttendanceCount);

router.get('/', lecturesController.getAllLectures);
router.get('/:id', lecturesController.getLecturesById);

// router.put('/:id', authMiddleware, lecturesController.updateLecturesById);
// router.delete('/:id', authMiddleware, lecturesController.deleteLecturesById);

module.exports = router;