const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/customersController');

// Public endpoint for customer self-registration
router.post('/', ctrl.create);

// Protected routes
router.get('/', auth, rbac('Advisor', 'Admin'), ctrl.getAll);
router.get('/:id', auth, rbac('Advisor', 'Admin'), ctrl.getById);
router.put('/:id', auth, rbac('Advisor', 'Admin'), ctrl.update);
router.delete('/:id', auth, rbac('Admin'), ctrl.delete);

module.exports = router;
