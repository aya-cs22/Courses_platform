const express = require('express');
const quizController = require('../controllers/quizesController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Create a new quiz
router.post('/', authenticate, quizController.createQuiz);

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get a quiz by ID
router.get('/:id', quizController.getQuizById);

// Update a quiz by ID
router.put('/:id', authenticate, quizController.updateQuizById);

// Delete a quiz by ID
router.delete('/:id', authenticate, quizController.deleteQuizById);


router.post('/submit', authenticate, quizController.submitQuiz);

module.exports = router;