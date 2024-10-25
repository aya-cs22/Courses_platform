const mongoose = require('mongoose');
//creat Schema for assignments

const assignmentsSchema = new mongoose.Schema({
  lecture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lectures',
    required: true
  },
  description:{
    type: String,
  },
  due_date:{
    type: Date,
    required: true
  },
  submitted_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  drive_link: {
    type: String,
    required: true
  },
  user_submission_link: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
});
assignmentsSchema.pre('save', async function(next){
  this.updated_at = Date.now();
  next()
});
const Assignments = mongoose.model('Assignments', assignmentsSchema);
module.exports = Assignments;