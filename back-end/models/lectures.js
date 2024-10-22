const mongoose = require('mongoose');
// creat schema for groups
const lecturesSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groups',
    required: true
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
  },
  qr_code:{
    type: String,
    // required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    updated_at: {
      type: Date,
      default: Date.now,
    },

    attendanceCount: {
      type: Number,
      default: 0
    },
});
lecturesSchema.pre('save', async function(next){
  this.updated_at = Date.now();
  next()
});
const Lectures = mongoose.model('Lectures', lecturesSchema);
module.exports = Lectures;