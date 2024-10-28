const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  taskLink: String,
  adminLink: String,
  deadline: Date,
  submittedOnTime: { type: Boolean, default: false },
  score: { type: Number, default: 0 }
});
// creat schema for groups
const lecturesSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groups',
    required: true
  },
  tasks: [taskSchema],
  submittedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Users',
    default: []
  },
  submittedOnTime: {
    type: Boolean,
    default: false
  },
  submissions: [{ 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submissionLink: String,
    submittedOnTime: Boolean,
    submittedAt: Date,
    evaluation: {
      score: Number,
      feedback: String,
      evaluatedAt: Date,
    },
  }],
  title:{
    type: String,
    required: true
  },
  description: {
    type: String, 
  },
  article:{
    type: String
  },
  resources:{
    type:[String],
    required: true
  },
  qr_code:{
    type: String,
    // required: true
  },
  attendees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Users',
    default: []
  },
  attendanceCount: {
    type: Number,
    default: 0
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
lecturesSchema.pre('save', async function(next){
  this.updated_at = Date.now();
  next()
});
const Lectures = mongoose.model('Lectures', lecturesSchema);
module.exports = Lectures;