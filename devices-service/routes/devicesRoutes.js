const express = require('express');
const deviceController = require('../controllers/devicesController');

const router = express.Router();

router.post('/', deviceController.createDevice);
router.get('/', deviceController.getAllDevices); 
router.get('/:id', deviceController.getDeviceById);
router.patch('/:id', deviceController.updateDeviceById);
router.delete('/:id', deviceController.deleteDeviceById);
router.get('/admin/:adminID', deviceController.getDevicesByAdminId); 
router.get('/client/:clientID', deviceController.getDevicesByClientId);

module.exports = router;
