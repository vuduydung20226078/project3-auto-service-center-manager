const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/bookingsController');

router.use(auth);

// Khách & Advisor
router.post('/', rbac('Customer', 'Advisor', 'Admin'), ctrl.create);
router.get('/', rbac('Customer', 'Advisor', 'Admin'), ctrl.list);
router.get('/:id', rbac('Customer', 'Advisor', 'Admin'), ctrl.getById);

// Advisor xác nhận / huỷ
router.put('/:id/confirm', rbac('Advisor', 'Admin'), ctrl.confirm);
router.put('/:id/cancel', rbac('Advisor', 'Admin'), ctrl.cancel);

module.exports = router;
