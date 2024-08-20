const SensorTopic = require('../models/sensorTopicModel');


  
exports.getSensorTopicsByMacAddress = async (req, res) => {
    try {
        console.log('Received MAC:', req.params.macAddress);
        const macAddress = req.params.macAddress;

        console.log('Fetching sensor topics with MAC in payload:', macAddress);
        const sensorTopics = await SensorTopic.find({ 'payload.MAC': macAddress });

        console.log('Fetched sensor topics:', sensorTopics);
        if (sensorTopics.length === 0) {
            console.log('No sensor topics found for MAC:', macAddress);
            return res.status(404).json({ error: 'Sensor topics not found' });
        }

        res.status(200).json(sensorTopics);
    } catch (error) {
        console.error('Error fetching sensor topics by MAC:', error);
        res.status(400).json({ error: 'Failed to retrieve sensor topics' });
    }
};

exports.getAllSensorTopics = async (req, res) => {
    try {
        console.log('Fetching all sensor topics');
        const sensorTopics = await SensorTopic.find({});

        console.log('Fetched sensor topics:', sensorTopics);
        if (sensorTopics.length === 0) {
            console.log('No sensor topics found');
            return res.status(404).json({ error: 'No sensor topics found' });
        }

        res.status(200).json(sensorTopics);
    } catch (error) {
        console.error('Error fetching all sensor topics:', error);
        res.status(400).json({ error: 'Failed to retrieve sensor topics' });
    }
};