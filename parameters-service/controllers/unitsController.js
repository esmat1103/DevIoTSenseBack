const Unit = require('../models/unitsModel');

function broadcast(wss, data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Create a new unit
const createUnit = async (req, res) => {
  try {
    const unit = new Unit(req.body);
    await unit.save();

    broadcast(req.app.locals.wss, { message: 'Unit created', unit });

    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all units
const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a unit by ID
const getUnitById = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a unit by ID
const updateUnitById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUnit = await Unit.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUnit) {
      return res.status(404).json({ message: 'Unit not found or already updated' });
    }

    broadcast(req.app.locals.wss, { message: 'Unit updated', unit: updatedUnit });

    res.status(200).json(updatedUnit);
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a unit by ID
const deleteUnitById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUnit = await Unit.findByIdAndDelete(id);
    if (!deletedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    broadcast(req.app.locals.wss, { message: 'Unit deleted', unitId: id });

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnitById,
  deleteUnitById
};
