const mongoose = require('mongoose');

const sensorTypeSchema = new mongoose.Schema({
  sensorReference: { type: String, required: true },
  sensorName: { type: String, required: true },
  unit: { type: String, required: true },
  pulse: { type: String, required: true },
  coefficient: { type: Number, required: false },
});

const SensorType = mongoose.model('SensorType', sensorTypeSchema);

module.exports = SensorType;
