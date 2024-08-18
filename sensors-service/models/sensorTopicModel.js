// models/sensorTopicModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema with flexible fields
const sensorTopicSchema = new Schema({
  MAC: { type: String },
  topic: { type: String },
  payload: { type: Map, of: Schema.Types.Mixed },
  timestamp: { type: Date },
  qos: { type: Number },
  retain: { type: Boolean },
  _msgid: { type: String }
}, { strict: false }); 

const SensorTopic = mongoose.model('SensorTopic', sensorTopicSchema, 'sensortopics');

module.exports = SensorTopic;
