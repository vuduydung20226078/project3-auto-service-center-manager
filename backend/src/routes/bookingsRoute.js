const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/bookingsController');

// Public endpoints for customer booking
router.post('/customer-booking', ctrl.createCustomerBooking); // New smart endpoint
router.post('/', ctrl.create); // Legacy endpoint

// Protected routes
router.get('/', auth, rbac('Customer', 'Advisor', 'Admin'), ctrl.list);
router.get('/:id', auth, rbac('Customer', 'Advisor', 'Admin'), ctrl.getById);

// Advisor xác nhận / huỷ
router.put('/:id/confirm', auth, rbac('Advisor', 'Admin'), ctrl.confirm);
router.put('/:id/cancel', auth, rbac('Advisor', 'Admin'), ctrl.cancel);

module.exports = router;
