const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Đăng nhập
router.post('/login', authController.login);

// Đăng ký
router.post('/register', authController.register);

// Refresh access token
router.post('/refresh', authController.refresh);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
