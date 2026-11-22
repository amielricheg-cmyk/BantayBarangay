const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginAdmin);
router.post('/logout', authController.logoutAdmin);
router.get('/logs', authController.getAuthLogs);

module.exports = router;
