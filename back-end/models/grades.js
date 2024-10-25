const mongoose = require('mongoose');
// Create schema for grades
const gradesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quizes',
    required: true 
  },
  score: {
    type: Number,
    required: true, 
    min: 0, 
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});
// Pre-save hook to update the `updated_at` field before saving
gradesSchema.pre('save', async function (next) {
  this.updated_at = Date.now();
  next();
});

const Grades = mongoose.model('Grades', gradesSchema);
module.exports = Grades;
