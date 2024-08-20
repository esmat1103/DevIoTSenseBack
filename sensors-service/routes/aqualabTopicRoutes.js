// routes/aqualabTopicRoutes.js
const express = require('express');
const router = express.Router();
const aqualabTopicController = require('../controllers/aqualabTopicController');

// Route to get sensors by MAC address and create/update smartinnov
router.get('/byMac/:mac', aqualabTopicController.getSensorsByMacAndCreateOrUpdate);

module.exports = router;
