const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  macAddress: { type: String, required: true },
  countryId: { type: String, required: true },
  countryName: { type: String, required: true },
  state: { type: String, required: true },
  clientsIDs: { type: [String], required: false },
  sensors: {
    type: [{
      ref: { type: String, required: true },
      id: { type: String, required: true }
    }],
    required: true
  },
  status: { type: String, required: true },
  adminID: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  paymentStatus: { type: Boolean,default: false, required: true },
  paymentDate: { type: Date, required: true }
}, {
  timestamps: true 
});

schema.index({ location: '2dsphere' });

const Device = mongoose.model('Device', schema);

module.exports = Device;
