const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});

const upload = multer({ storage });

router.use('/uploads', express.static(path.join(__dirname, './uploads')));

router.post('/admins', authenticateToken, authorize(['superadmin']), upload.single('profileImage'), userController.createAdmin);
router.post('/endusers', authenticateToken, authorize(['superadmin', 'admin']), upload.single('profileImage'), userController.createEnduser);

router.get('/:id', authenticateToken, authorize(['superadmin', 'admin']), userController.getUserById);

router.put('/updateAdmin/:id', authenticateToken, authorize(['superadmin']), upload.single('profileImage'), userController.updateAdmin);
router.put('/updateEndUser/:id', authenticateToken, authorize(['superadmin', 'admin']), upload.single('profileImage'), userController.updateEndUser);
router.put('/email/:email/password', userController.updatePassword);


router.delete('/:id', authenticateToken, authorize(['superadmin']), userController.deleteUser);
router.get('/email/:email', userController.getUserByEmail);
router.get('/role/admin', authenticateToken, authorize(['superadmin']), userController.getAllAdmins);
router.get('/role/enduser', authenticateToken, authorize(['superadmin', 'admin']), userController.getAllEndUsers);
router.post('/reset-password', userController.resetPassword);

module.exports = router;