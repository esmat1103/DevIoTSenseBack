// controllers/aqualabTopicController.js
const mongoose = require('mongoose');
const createSensorModel = require('../models/aqualabTopicModel'); 
const SensorTopic = require('../models/sensorTopicModel'); 

const aqualabMongoURI = 'mongodb://162.19.25.155:27017/iotsense';
const smartinnovMongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartinnov';

const aqualabConnection = mongoose.createConnection(aqualabMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const smartinnovConnection = mongoose.createConnection(smartinnovMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Sensor = createSensorModel(aqualabConnection);

// Controller to fetch sensors by MAC address and create/update SensorTopic
const getSensorsByMacAndCreateOrUpdate = async (req, res) => {
  const { mac } = req.params; // Get the MAC address from URL parameters
  console.log(`Received request to fetch sensors for MAC address: ${mac}`);

  try {
    // Fetch sensors by MAC address from the iotsense database
    const sensors = await Sensor.find({ 'payload.MAC': mac });
    console.log(`Found ${sensors.length} sensors with MAC address ${mac}`);

    if (sensors.length === 0) {
      console.log('No sensors found with the given MAC address');
      return res.status(404).json({ message: 'No sensors found with the given MAC address' });
    }

    // Process each sensor reading and create/update documents in the smartinnov database
    for (const sensor of sensors) {
      const sensorData = {
        data: sensor.payload, // Directly use the payload with dynamic fields
        timestamp: sensor.payload.timestamp,
      };

      console.log(`Processing sensor data for MAC address ${mac}:`, sensorData);

      // Create a new SensorTopic or update the existing one with the new reading
      const updatedTopic = await SensorTopic.findOneAndUpdate(
        { MacAddress: mac },
        { $push: { readings: sensorData } },
        { upsert: true, new: true, useFindAndModify: false, connection: smartinnovConnection }
      );

      console.log(`Updated SensorTopic for MAC address ${mac}:`, updatedTopic);
    }

    res.json({ message: 'Data successfully processed and updated in smartinnov database' });
  } catch (err) {
    console.error('Error processing sensors by MAC and updating smartinnov:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSensorsByMacAndCreateOrUpdate,
};
