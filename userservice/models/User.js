const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, validate: [isEmail, 'Invalid email'] },
  password: { type: String, required: true },
  subscription_status: { type: Boolean, default: true, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['superadmin', 'admin', 'secondaryadmin', 'enduser'] 
  },
  phoneNumber: { 
    type: String,
    required: function() { return this.role !== 'superadmin'; } 
  },
  profileImage: {
    type: String,
    required: false,
  },
  createdByAdmin: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: function() { return this.role === 'enduser'; },
    default: undefined, // Ensure it’s not set by default
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    required: function() { return this.role !== 'superadmin'; } 
  },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    console.log(`Hashing password for user ${this.email}`);
    this.password = await bcrypt.hash(this.password.trim(), salt);
    console.log(`Hashed password: ${this.password}`);
  }
  next();
});

const User = mongoose.model('User', userSchema, 'userservice_users');

module.exports = User;
