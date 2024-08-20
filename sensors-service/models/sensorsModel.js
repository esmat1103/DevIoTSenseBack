const mongoose = require('mongoose');

const paramSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const sensorSchema = new mongoose.Schema({
  type: { type: String, required: true },
  thresholdMin: { type: Number, required: false },
  thresholdMax: { type: Number, required: false },
  rangeMin: { type: Number, required: false },
  rangeMax: { type: Number, required: false },
  startIndex: { type: Number, required: false },
  state: { type: String, required: false },
  params: { type: [paramSchema], required: false },
  macAddress:{ type: String, required: true },
  deviceID: { type: String, required: false },
  sensorID:{ type: String, required: true },
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
