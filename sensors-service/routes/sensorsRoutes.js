const express = require('express');
const sensorController = require('../controllers/sensorsController');

const router = express.Router();

router.post('/', sensorController.createSensor);
router.get('/', sensorController.getAllSensors);
router.get('/:id', sensorController.getSensorById);
router.patch('/:id', sensorController.updateSensorById);
router.delete('/:id', sensorController.deleteSensorById);
router.get('/device/:deviceId', sensorController.getSensorsByDevice);


module.exports = router;
