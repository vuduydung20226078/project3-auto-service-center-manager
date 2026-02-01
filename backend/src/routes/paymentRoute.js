const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const vnpayController = require('../controllers/vnpayController');

// Create payment and get payment URL
router.post('/create', paymentController.initializeVnPay);

// VNPAY IPN callback (called by VNPAY server)
router.get('/vnpay/ipn', vnpayController.handleVnpayIPN);

// VNPay return URL (user redirected back from VNPAY)
router.get('/vnpay/return', vnpayController.handleVnpayReturn);
// Allow frontend to forward return params to backend for processing
router.post('/vnpay/return', vnpayController.handleVnpayReturnPost);

module.exports = router;