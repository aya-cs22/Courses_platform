const mongoose = require('mongoose');
// creat schema for question
const questionSchema = new mongoose.Schema({
  question_text: {
    type: String,
  },
  options: [{
    type: String,
    required: true,
  }],
  correct_answer:{
    type: String,
    required: true
  },
});

// Create schema for quizzes
const quizeSchema = new mongoose.Schema({
  lecture_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lectures',
    required: true
  },
  title:{
    type: String,
  },
  description:{
    type: String
  },
  questions: [questionSchema],
  created_at: {
    type: Date,
    default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
});

// Pre-save hook to update `updated_at` field before saving
quizeSchema.pre('save', async function (next) {
    this.updated_at = Date.now();
    next();
  });
  
  const Quizes = mongoose.model('Quizes', quizeSchema);
  module.exports = Quizes;