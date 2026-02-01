const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const attachCustomer = require('../middlewares/attachCustomer');
const ctrl = require('../controllers/vehiclesController');

// Protected routes - attachCustomer runs after auth to set req.customerId
router.use(auth, attachCustomer);

router.get('/', rbac('Customer', 'Advisor', 'Admin'), ctrl.getAll);
router.get('/:id', rbac('Customer', 'Advisor', 'Admin'), ctrl.getById);
router.get('/:id/service-history', rbac('Customer', 'Advisor', 'Admin'), ctrl.getServiceHistory);
router.post('/', rbac('Customer', 'Advisor', 'Admin'), ctrl.create);
router.put('/:id', rbac('Customer', 'Advisor', 'Admin'), ctrl.update);
router.delete('/:id', rbac('Customer', 'Advisor', 'Admin'), ctrl.delete);

module.exports = router;
