const mongoose = require('mongoose');
// creat a schema for Languages
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  }
});
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  question: [questionSchema],
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lectures',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
quizSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// creat and export lesson module
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;

