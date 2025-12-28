const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/vehiclesController');

router.use(auth);

router.get('/', rbac('Advisor', 'Admin'), ctrl.getAll);
router.get('/:id', rbac('Advisor', 'Admin'), ctrl.getById);
router.post('/', rbac('Advisor', 'Admin'), ctrl.create);
router.put('/:id', rbac('Advisor', 'Admin'), ctrl.update);
router.delete('/:id', rbac('Admin'), ctrl.delete);

module.exports = router;
