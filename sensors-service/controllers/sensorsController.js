const Sensor = require('../models/sensorsModel');

// Broadcast function using Socket.IO
function broadcast(io, event, data) {
  io.emit(event, data);  // Emit an event to all connected clients
}

// Create a new sensor
const createSensor = async (req, res) => {
  try {
    const sensor = new Sensor(req.body);
    await sensor.save();

    // Broadcast to Socket.IO clients
    broadcast(req.app.locals.io, 'sensorCreated', { message: 'Sensor created', sensor });

    res.status(201).json(sensor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sensors
const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a sensor by ID
const getSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const sensor = await Sensor.findById(id);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a sensor by ID
const updateSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSensor = await Sensor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSensor) {
      return res.status(404).json({ message: 'Sensor not found or already updated' });
    }

    broadcast(req.app.locals.io, 'sensorUpdated', { message: 'Sensor updated', sensor: updatedSensor });

    res.status(200).json(updatedSensor);
  } catch (error) {
    console.error('Error updating sensor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a sensor by ID
const deleteSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSensor = await Sensor.findByIdAndDelete(id);
    if (!deletedSensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    broadcast(req.app.locals.io, 'sensorDeleted', { message: 'Sensor deleted', sensorId: id });

    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSensorsByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params; // Use req.params to get the deviceId

    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }

    if (typeof deviceId !== 'string') {
      return res.status(400).json({ message: 'Invalid Device ID format' });
    }

    const sensors = await Sensor.find({ deviceID: deviceId });
    res.status(200).json(sensors);
  } catch (error) {
    console.error('Error fetching sensors by device:', error);
    res.status(500).json({ message: 'Failed to fetch sensors' });
  }
};


module.exports = {
  createSensor,
  getAllSensors,
  getSensorById,
  updateSensorById,
  deleteSensorById,
  getSensorsByDevice
};
