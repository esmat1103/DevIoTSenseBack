const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  SensorType: { type: String, required: true },
  MeasuredParameter: { type: String, required: true },
  unitName: { type: String, required: true },
  Abbreviation: { type: String, required: false }
}, { timestamps: true });

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;