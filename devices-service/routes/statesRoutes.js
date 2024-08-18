const express = require('express');
const stateController = require('../controllers/states');


const router = express.Router();

router.get('/', stateController.getStates);

module.exports = router;
