const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/workOrdersController');

// Middleware xác thực
router.use(auth);

// Tạo work order từ booking
router.post('/', rbac('Advisor', 'Admin'), ctrl.createFromBooking);

// Lấy chi tiết work order
router.get('/:id', rbac('Advisor', 'Tech', 'Admin', 'Accountant'), ctrl.get);

// Lấy tất cả work orders
router.get('/', rbac('Advisor', 'Tech', 'Admin', 'Accountant'), ctrl.listAll);

// Thêm item (Service/Part) vào work order
router.post('/:id/items', rbac('Advisor', 'Admin'), ctrl.addItem);

// Gán kỹ thuật viên vào work order
router.post('/:id/assign', rbac('Advisor', 'Admin'), ctrl.assignTech);

// Cập nhật trạng thái work order
router.put('/:id/status', rbac('Advisor', 'Admin'), ctrl.updateStatus);

// Xóa work order
router.delete('/:id', rbac('Admin'), ctrl.delete);

module.exports = router;
