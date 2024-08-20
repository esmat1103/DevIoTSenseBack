// In sensorTopicRoutes.js
const express = require('express');
const router = express.Router();
const sensorTopicController = require('../controllers/sensorsTopicController');


router.get('/:macAddress', sensorTopicController.getSensorTopicsByMacAddress);
router.get('/', sensorTopicController.getAllSensorTopics);

module.exports = router;
