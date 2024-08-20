const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'enduser'],
    default: 'enduser',
  },
  subscription_status: {
    type: Boolean,
    required: true,
  },
});

const AuthUser = mongoose.model('AuthUser', authUserSchema);

module.exports = AuthUser;