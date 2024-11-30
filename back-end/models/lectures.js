const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  taskLink: String,
  description_task: String,
  start_date: Date,
  end_date: Date,

  submissions: [ 
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      submissionLink: {
        type: String,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        default: null
      }
    }
  ]
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
    ref: 'User',
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