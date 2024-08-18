const SensorType = require('../models/typesModel');

function broadcast(io, data) {
  if (!io) {
    console.error('Socket.IO instance is not available');
    return;
  }
  io.emit('sensorTypeUpdate', data); 
}

const createSensorType = async (req, res) => {
  try {
    const sensorType = new SensorType(req.body);
    await sensorType.save();

    broadcast(req.app.locals.io, { message: 'Sensor Type created', sensorType });

    res.status(201).json(sensorType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllSensorTypes = async (req, res) => {
  try {
    const sensorTypes = await SensorType.find();
    res.status(200).json(sensorTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSensorTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const sensorType = await SensorType.findById(id);
    if (!sensorType) {
      return res.status(404).json({ message: 'Sensor Type not found' });
    }
    res.status(200).json(sensorType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSensorTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSensorType = await SensorType.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSensorType) {
      return res.status(404).json({ message: 'Sensor Type not found or already updated' });
    }

    broadcast(req.app.locals.io, { message: 'Sensor Type updated', sensorType: updatedSensorType });

    res.status(200).json(updatedSensorType);
  } catch (error) {
    console.error('Error updating sensor type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSensorTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSensorType = await SensorType.findByIdAndDelete(id);
    if (!deletedSensorType) {
      return res.status(404).json({ message: 'Sensor Type not found' });
    }

    broadcast(req.app.locals.io, { message: 'Sensor Type deleted', sensorTypeId: id });

    res.status(200).json({ message: 'Sensor Type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSensorType,
  getAllSensorTypes,
  getSensorTypeById,
  updateSensorTypeById,
  deleteSensorTypeById
};
