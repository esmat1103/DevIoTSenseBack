const express = require('express');
const countryController = require('../controllers/countries');

const router = express.Router();

router.get('/:id', countryController.getCountryById);
router.get('/', (req, res) => {
  console.log('GET /countries called');
  countryController.getCountries(req, res);
});

module.exports = router;
