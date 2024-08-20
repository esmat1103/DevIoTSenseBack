const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, validate: [isEmail, 'Invalid email'] },
  password: { type: String, required: true },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.role === 'enduser'; }
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

async function seedSuperadmins() {
  try {
    const existingSuperadmins = await User.find({ role: 'superadmin' });

    if (existingSuperadmins.length === 0) {
      console.log('Seeding initial superadmins...');

      const superadmins = [
        {
          firstName: 'Afef',
          lastName: 'Bohli',
          email: 'AfefBohli@example.com',
          password: 'password123',
          role: 'superadmin'
        },
        {
          firstName: 'Naoufel',
          lastName: 'Test',
          email: 'NaoufelTest@example.com',
          password: 'password321',
          role: 'superadmin'
        }
      ];

      for (let superadmin of superadmins) {
        const salt = await bcrypt.genSalt();
        superadmin.password = await bcrypt.hash(superadmin.password, salt);
      }

      await User.insertMany(superadmins);
      console.log('Superadmins seeded successfully');
    } else {
      console.log('Superadmins already exist');
    }
  } catch (error) {
    console.error('Error seeding superadmins:', error);
  }
}

seedSuperadmins();

module.exports = User;
