const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: String,
  message: String,
  type: String,
  timestamp: Date,
  title: String,
  read: Boolean,
  actionRequired: { type: Boolean, required: false }, 
  actionStatus: { type: String, required: false },
  actionDetails: { type: String, required: false },
});

module.exports = mongoose.model('Notification', notificationSchema);
