const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintsController');

router.post('/', complaintController.createComplaint);
router.get('/:id', complaintController.getComplaintById);
router.get('/', complaintController.getAllComplaints);
router.delete('/:id', complaintController.deleteComplaint);
router.put('/:id', complaintController.updateComplaintById); 


module.exports = router;
