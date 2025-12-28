const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/workOrdersController');

// Middleware xác thực
router.use(auth);

// Get statistics 
router.get('/stats', rbac('Advisor', 'Tech', 'Admin', 'Accountant'), ctrl.getStats);

// Lấy tất cả work orders
router.get('/', rbac('Advisor', 'Tech', 'Admin', 'Accountant'), ctrl.listAll);

// Tạo work order trực tiếp với items (walk-in)
router.post('/', rbac('Advisor', 'Admin'), ctrl.create);

// Tạo work order từ booking
router.post('/from-booking', rbac('Advisor', 'Admin'), ctrl.createFromBooking);

// Lấy chi tiết work order 
router.get('/:id', rbac('Advisor', 'Tech', 'Admin', 'Accountant'), ctrl.get);

// Thêm item (Service/Part) vào work order
router.post('/:id/items', rbac('Advisor', 'Admin'), ctrl.addItem);

// Gán kỹ thuật viên vào work order
router.post('/:id/assign', rbac('Advisor', 'Admin'), ctrl.assignTech);

// Cập nhật trạng thái work order
router.patch('/:id/status', rbac('Advisor', 'Admin'), ctrl.updateStatus);

// Xóa work order
router.delete('/:id', rbac('Admin'), ctrl.delete);

module.exports = router;
