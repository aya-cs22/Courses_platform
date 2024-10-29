const express = require('express');
const quizController = require('../controllers/quizesController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();
router.post('/', authenticate, quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);
router.put('/:id', authenticate, quizController.updateQuizById);
router.delete('/:id', authenticate, quizController.deleteQuizById);
router.post('/submit', authenticate, quizController.submitQuiz);

module.exports = router;