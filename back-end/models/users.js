const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'too short password']
  },
  isVerified: {
    type: Boolean,
    default: false // user need to virify your email
  },
  phone_number: {
    type: String,
    required: true,
    minlength: [11, 'too short password']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'assistant'],
    default: function () {
      return this.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    }
  },

  groupId: [{
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups' }
  }],

  date_group: {
    type: Date,
  },

  feedback: {
    type: String,
  },
  emailVerificationCode: { // Email verification code, set when a verification code is sent to the user
    type: String,
    default: null
  },
  verificationCodeExpiry: { // Verification code expiration date
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiry: {
    type: Date,
    default: null
  },

  attendance: [
    {
      lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lectures',
        required: true
      },
      attended: {
        type: Boolean,
        default: false
      },
      attendedAt: {
        type: Date,
        default: null
      }
    }
  ],
  tasks: [
    {
      lectureId: mongoose.Schema.Types.ObjectId,
      taskId: mongoose.Schema.Types.ObjectId,
      submissionLink: String,
      submittedOnTime: Boolean,
      submittedAt: Date,
      score: Number,
    },
  ],




  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },

});

// Before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Encrypt the password before saving
  this.password = await bcrypt.hash(this.password, 10);
  this.updated_at = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;