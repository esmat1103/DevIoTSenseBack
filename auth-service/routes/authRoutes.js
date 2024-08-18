const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/sendVerificationEmail', authController.sendVerificationEmail);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
