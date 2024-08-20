// models/aqualabTopicModel.js
const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
  topic: String,
  payload: { type: Map, of: mongoose.Schema.Types.Mixed }, 
  qos: Number,
  retain: Boolean,
  _msgid: String,
}, { strict: false }); 

module.exports = (connection) => connection.model('Sensor', SensorSchema, 'sensors');
