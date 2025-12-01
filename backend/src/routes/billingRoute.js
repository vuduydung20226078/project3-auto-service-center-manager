const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/billingController');

// Middleware xác thực
router.use(auth);

// Tạo hóa đơn từ work order
router.post('/invoices', rbac('Accountant', 'Admin'), ctrl.createInvoice);

// Lấy hóa đơn theo ID
router.get('/invoices/:id', rbac('Accountant', 'Admin', 'Advisor'), ctrl.getInvoice);

// Thêm thanh toán vào hóa đơn
router.post('/invoices/:id/payments', rbac('Accountant', 'Admin'), ctrl.addPayment);

module.exports = router;
