const Device = require('../models/devicesModel');
const broadcast = require('../utils/broadcast');

// Create a new device
const createDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    await device.save();

    broadcast(req.app.locals.wss, { message: 'Device created', device });

    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all devices
const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);

    broadcast(req.app.locals.wss, { message: 'Devices fetched', devices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a device by ID
const getDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json(device);

    broadcast(req.app.locals.wss, { message: 'Device fetched', device });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a device by ID
const updateDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDevice = await Device.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found or already updated' });
    }

    broadcast(req.app.locals.wss, { message: 'Device updated', device: updatedDevice });

    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a device by ID
const deleteDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDevice = await Device.findByIdAndDelete(id);
    if (!deletedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    broadcast(req.app.locals.wss, { message: 'Device deleted', deviceId: id });

    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDevicesByAdminId = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    const devices = await Device.find({ adminID: adminID });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDevicesByClientId = async (req, res) => {
  try {
    const clientID = req.params.clientID;
    const devices = await Device.find({ clientsIDs: clientID }); 
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDeviceById,
  deleteDeviceById,
  getDevicesByAdminId,
  getDevicesByClientId
};