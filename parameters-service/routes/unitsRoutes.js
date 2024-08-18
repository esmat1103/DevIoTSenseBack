const express = require('express');
const router = express.Router();
const {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnitById,
  deleteUnitById
} = require('../controllers/unitsController'); 

router.post('/', createUnit);
router.get('/', getAllUnits);
router.get('/:id', getUnitById);
router.put('/:id', updateUnitById);
router.delete('/:id', deleteUnitById);

module.exports = router;
