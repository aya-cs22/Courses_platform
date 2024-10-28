const Quiz = require('../models/quizzes');
const Lecture = require('../models/lectures');
const User = require('../models/users');
const Submission = require('../models/submissions');
// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
};
// Get a quiz by its ID
exports.getQuizById = async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(quiz);
    } catch (error) {
      console.error('Error fetching quiz by ID:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Update a quiz by ID
exports.updateQuizById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error.message);
    res.status(500).json({ message: 'Server error while updating quiz' });
  }
};

// Delete a quiz by ID
exports.deleteQuizById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
    console.log('User ID:', req.user._id);
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);

    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // تحقق من وجود المستخدم
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing in request' });
    }

    let score = 0;
    quiz.question.forEach((question, index) => {
      if (question.correctAnswer === answers[index]?.answer) {
        score++;
      }
    });

    const submission = new Submission({
      userId: req.user.id,
      quizId,
      answers,
      score
    });

    await submission.save();

    res.status(200).json({
      message: 'Quiz submitted successfully',
      score,
      totalScore: quiz.question.length
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error while submitting quiz' });
  }
};
