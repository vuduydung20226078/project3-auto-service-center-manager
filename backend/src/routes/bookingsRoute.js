const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const attachCustomer = require('../middlewares/attachCustomer');
const ctrl = require('../controllers/bookingsController');

// Public endpoints for customer booking
router.post('/customer-booking', ctrl.createCustomerBooking); // New smart endpoint

// Protected routes - attachCustomer runs after auth to set req.customerId
router.use(auth, attachCustomer);

router.post('/', rbac('Customer', 'Advisor', 'Admin'), ctrl.create);
router.get('/', rbac('Customer', 'Advisor', 'Admin'), ctrl.list);
router.get('/:id', rbac('Customer', 'Advisor', 'Admin'), ctrl.getById);

// Advisor xác nhận / huỷ
router.put('/:id/confirm', rbac('Advisor', 'Admin'), ctrl.confirm);
router.put('/:id/cancel', rbac('Advisor', 'Admin'), ctrl.cancel);

module.exports = router;
