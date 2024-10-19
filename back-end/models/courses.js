const mongoose = require('mongoose');
const CoursesSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  description: {
    type: String, 
  },
  type_course: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  location:{
    type: String,
    required: function() { return this.type_course === 'offline'; } //This field is only required if the course is offline
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
CoursesSchema.pre('save', async function (next) {
  this.updated_at = Date.now();
  next();
});
const Courses = mongoose.model('Courses', CoursesSchema);
module.exports = Courses;