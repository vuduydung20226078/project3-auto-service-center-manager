const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/stocksController');

router.use(auth);

router.get('/', rbac('Admin', 'Warehouse', 'Advisor'), ctrl.list);
router.post('/entries', rbac('Warehouse', 'Admin'), ctrl.addEntry); // IN/OUT manual
router.get('/low', rbac('Admin', 'Warehouse'), ctrl.low);

module.exports = router;
