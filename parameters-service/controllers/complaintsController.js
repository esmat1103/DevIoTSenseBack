const axios = require('axios');
const Complaint = require('../models/complaintsModel');
const WebSocket = require('ws'); 

const DEVICESERVICE_URL = 'http://162.19.25.155:4002';
const SENSORSERVICE_URL = 'http://162.19.25.155:3001';


function broadcast(wss, data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}


const createComplaint = async (req, res) => {
    try {
        const { subject, details, category, urgency, deviceId, sensorId, actionDue, latestRecordedData, lastCommunication, userName, userId } = req.body;

        if (!subject || !details || !category || !urgency || !deviceId || !sensorId || !actionDue || !latestRecordedData || !lastCommunication || !userName || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!['service', 'product', 'billing', 'technical', 'other'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        if (!['Low', 'Medium', 'High'].includes(urgency)) {
            return res.status(400).json({ message: 'Invalid urgency' });
        }

        const parsedActionDue = new Date(actionDue);
        const parsedLastCommunication = new Date(lastCommunication);

        if (isNaN(parsedActionDue.getTime()) || isNaN(parsedLastCommunication.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const complaint = new Complaint({
            subject,
            details,
            category,
            urgency,
            deviceId,
            sensorId,
            actionDue: parsedActionDue,
            latestRecordedData,
            lastCommunication: parsedLastCommunication,
            complaintStatus: 'Open',
            userName,
            userId
        });

        await complaint.save();

        broadcast(req.app.locals.wss, { type: 'COMPLAINT_CREATED', complaint });

        res.status(201).json({ message: 'Complaint created successfully', complaint });
    } catch (error) {
        console.error('Error creating complaint:', error.message);
        res.status(500).json({ message: 'Failed to create complaint', error: error.message });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();

        const complaintsWithDetails = await Promise.all(complaints.map(async complaint => {
            try {
                const deviceResponse = await axios.get(`${DEVICESERVICE_URL}/devices/${complaint.deviceId}`);
                const sensorResponse = await axios.get(`${SENSORSERVICE_URL}/sensors/${complaint.sensorId}`);

                return {
                    ...complaint.toObject(),
                    device: deviceResponse.data,
                    sensor: sensorResponse.data,
                };
            } catch (externalError) {
                console.error(`Error fetching details for complaint ${complaint._id}:`, externalError.message);
                return {
                    ...complaint.toObject(),
                    device: null,
                    sensor: null,
                    error: externalError.message,
                };
            }
        }));

        res.status(200).json(complaintsWithDetails);
    } catch (error) {
        console.error('Error fetching complaints:', error.message);
        res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const deviceResponse = await axios.get(`${DEVICESERVICE_URL}/devices/${complaint.deviceId}`);
        const sensorResponse = await axios.get(`${SENSORSERVICE_URL}/sensors/${complaint.sensorId}`);

        const complaintData = {
            ...complaint.toObject(),
            device: deviceResponse.data,
            sensor: sensorResponse.data,
        };

        res.status(200).json(complaintData);
    } catch (error) {
        console.error('Error fetching complaint:', error.message);
        res.status(500).json({ message: 'Failed to fetch complaint', error: error.message });
    }
};

const updateComplaintById = async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found or already updated' });
        }

        broadcast(req.app.locals.wss, { type: 'COMPLAINT_UPDATED', complaint: updatedComplaint });

        res.status(200).json(updatedComplaint);
    } catch (error) {
        console.error('Error updating complaint:', error.message);
        res.status(500).json({ message: 'Failed to update complaint', error: error.message });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

        if (!deletedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        broadcast(req.app.locals.wss, { type: 'COMPLAINT_DELETED', complaintId: req.params.id });

        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Error deleting complaint:', error.message);
        res.status(500).json({ message: 'Failed to delete complaint', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintById,
    deleteComplaint
};
