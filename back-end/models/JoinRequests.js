const mongoose = require("mongoose");

const JoinRequestsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groups',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  startDate: {
    type: Date, // Membership start date
  },
  endDate: {
    type: Date, // Membership End date
  },
  lifetimeAccess: {
    type: Boolean,
    default: false, // False if it's not lifetime access
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

JoinRequestsSchema.pre('save', async function (next) {
  this.updated_at = Date.now();
  next();
});

const JoinRequests = mongoose.model('JoinRequests', JoinRequestsSchema);
module.exports = JoinRequests;
