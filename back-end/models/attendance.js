const mongoose = require('mongoose');
// Create schema for attendance
const attendanceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lecture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lectures',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'], 
    required: true
  },
  attendance_date: {
    type: Date,
    default: Date.now, // Date when the attendance is recorded.
    required: true
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
attendanceSchema.pre('save', async function (next) {
  this.updated_at = Date.now();
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
