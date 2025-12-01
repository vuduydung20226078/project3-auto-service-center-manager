const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/dashBoardController');

// Middleware xác thực
router.use(auth);

// Lấy tổng quan dashboard
router.get('/summary', rbac('Admin', 'Advisor', 'Accountant'), ctrl.summary);

module.exports = router;
