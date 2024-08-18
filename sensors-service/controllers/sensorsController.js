const Sensor = require('../models/sensorsModel');

function broadcast(io, data) {
  io.emit('sensorUpdate', data); 
}

const createSensor = async (req, res) => {
  try {
    const sensor = new Sensor(req.body);
    await sensor.save();

    broadcast(req.app.locals.io, { message: 'Sensor created', sensor });

    res.status(201).json(sensor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const updateSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSensor = await Sensor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSensor) {
      return res.status(404).json({ message: 'Sensor not found or already updated' });
    }

    broadcast(req.app.locals.io, { message: 'Sensor updated', sensor: updatedSensor });

    res.status(200).json(updatedSensor);
  } catch (error) {
    console.error('Error updating sensor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSensor = await Sensor.findByIdAndDelete(id);
    if (!deletedSensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    broadcast(req.app.locals.io, { message: 'Sensor deleted', sensorId: id });

    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSensorsByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findById(deviceId).populate('sensors'); 
    if (device) {
      res.json({
        deviceId: device._id,
        sensors: device.sensors 
      });
    } else {
      res.status(404).json({ message: 'Device not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSensorBySensorID = async (req, res) => {
  const { sensorID } = req.params;  
  try {
    const sensor = await Sensor.findOne({ sensorID });  
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createSensor,
  getAllSensors,
  getSensorById,
  updateSensorById,
  deleteSensorById,
  getSensorsByDevice,
  getSensorBySensorID
};
