const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/dashBoardController');

// Middleware xác thực
router.use(auth);

// Lấy tổng quan dashboard
router.get('/summary', rbac('Admin', 'Advisor', 'Accountant'), ctrl.summary);
router.get('/stock-stats', rbac('Admin', 'Warehouse', 'Advisor'), ctrl.stockStats);
router.get('/stock-movement', rbac('Admin', 'Warehouse', 'Advisor'), ctrl.stockMovement);
router.get('/top-low-stock', rbac('Admin', 'Warehouse', 'Advisor'), ctrl.topLowStock);
router.get('/recent-entries', rbac('Admin', 'Warehouse', 'Advisor'), ctrl.recentEntries);

module.exports = router;
