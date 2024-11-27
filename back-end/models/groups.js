const mongoose = require('mongoose');
//creat schema for groups
const groupsSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  type_course: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: function () {
      return this.type_course === 'offline'; // Required only if offline
    },
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  lifetimeAccess: {
    type: Boolean,
    default: false, // False if it's not lifetime access
  },
  members: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    accessExpiresAt: { type: Date},
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
groupsSchema.pre('save', async function (next) {
  this.updated_at = Date.now();
  next();
});
const Groups = mongoose.model('Groups', groupsSchema);
module.exports = Groups;