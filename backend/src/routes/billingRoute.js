const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/billingController');

// Middleware xác thực
router.use(auth);

// Lấy danh sách work orders đã hoàn thành (để tạo invoice)
router.get('/completed-work-orders', rbac('Accountant', 'Admin'), ctrl.getCompletedWorkOrders);

// Lấy chi tiết work order để tạo invoice (bao gồm services và parts)
router.get('/work-orders/:id/details', rbac('Accountant', 'Admin'), ctrl.getWorkOrderForInvoice);

// Lấy danh sách tất cả hóa đơn
router.get('/invoices', rbac('Accountant', 'Admin', 'Advisor'), ctrl.getAllInvoices);

// Tạo hóa đơn từ work order
router.post('/invoices', rbac('Accountant', 'Admin'), ctrl.createInvoice);

// Lấy hóa đơn theo ID
router.get('/invoices/:id', rbac('Accountant', 'Admin', 'Advisor'), ctrl.getInvoice);

// Cập nhật hóa đơn
router.put('/invoices/:id', rbac('Accountant', 'Admin'), ctrl.updateInvoice);

// Xóa hóa đơn
router.delete('/invoices/:id', rbac('Admin'), ctrl.deleteInvoice);

// Cập nhật trạng thái hóa đơn
router.patch('/invoices/:id/status', rbac('Accountant', 'Admin'), ctrl.updateInvoiceStatus);

// Lấy thống kê hóa đơn
router.get('/invoices-stats', rbac('Accountant', 'Admin', 'Advisor'), ctrl.getInvoiceStats);

// Lấy danh sách thanh toán của hóa đơn
router.get('/invoices/:id/payments', rbac('Accountant', 'Admin', 'Advisor'), ctrl.getInvoicePayments);

// Thêm thanh toán vào hóa đơn
router.post('/invoices/:id/payments', rbac('Accountant', 'Admin'), ctrl.addPayment);

module.exports = router;
