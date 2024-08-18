const express = require('express');
const sensorTypesController = require('../controllers/typesController');

const router = express.Router();

router.post('/', sensorTypesController.createSensorType);
router.get('/', sensorTypesController.getAllSensorTypes);
router.get('/:id', sensorTypesController.getSensorTypeById);
router.patch('/:id', sensorTypesController.updateSensorTypeById);
router.delete('/:id', sensorTypesController.deleteSensorTypeById);

module.exports = router;
