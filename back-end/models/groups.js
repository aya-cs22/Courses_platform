const mongoose = require('mongoose');
//creat schema for groups
const groupsSchema = new mongoose.Schema({
  course_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },
  title:{
    type: String,
    required: true
  },
  start_date: {
    type:Date,
    required: true
  },
  end_date: {
    type:Date,
    required: true
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
groupsSchema.pre('save', async function(next){
this.updated_at = Date.now();
  next();
});
const Groups = mongoose.model('Groups', groupsSchema);
module.exports = Groups;