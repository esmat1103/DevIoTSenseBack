const express = require('express');
const sensorController = require('../controllers/sensorsController');

const router = express.Router();

router.post('/sensors', sensorController.createSensor);
router.get('/sensors', sensorController.getAllSensors);
router.get('/sensors/:id', sensorController.getSensorById);
router.patch('/sensors/:id', sensorController.updateSensorById);
router.delete('/sensors/:id', sensorController.deleteSensorById);
router.get('/device/:deviceId', sensorController.getSensorsByDevice);
router.get('/sensors/sensorID/:sensorID', sensorController.getSensorBySensorID);


module.exports = router;
