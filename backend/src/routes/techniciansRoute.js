const express = require('express');
const router = express.Router();
const techniciansController = require('../controllers/techniciansController');
const authenticate = require('../middlewares/auth');

// Tất cả routes đều require authentication
router.use(authenticate);

// GET /api/technicians - Lấy danh sách technicians
router.get('/', techniciansController.list);

// GET /api/technicians/:id - Lấy chi tiết technician
router.get('/:id', techniciansController.get);

// POST /api/technicians - Tạo technician mới
router.post('/', techniciansController.create);

// PUT /api/technicians/:id/status - Cập nhật trạng thái
router.put('/:id/status', techniciansController.updateStatus);

// DELETE /api/technicians/:id - Xóa technician
router.delete('/:id', techniciansController.delete);

module.exports = router;
