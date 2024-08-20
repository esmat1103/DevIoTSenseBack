const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['service', 'product', 'billing', 'technical', 'other'],
        required: true
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    sensorId: {
        type: String,
        ref: 'Sensor',
        required: true
    },
    actionDue: {
        type: Date,
        required: true
    },
    latestRecordedData: {
        type: String,
        required: true
    },
    lastCommunication: {
        type: Date,
        required: true
    },
    complaintStatus: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    },
    userName: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
