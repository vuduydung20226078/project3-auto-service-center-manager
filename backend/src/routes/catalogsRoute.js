const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/catalogsController');

router.use(auth);

//services routes
router.get('/services', rbac('Admin', 'Advisor', 'Tech', 'Customer'), ctrl.listServices);
router.post('/services', rbac('Admin'), ctrl.createService);
router.put('/services/:id', rbac('Admin'), ctrl.updateService);
router.delete('/services/:id', rbac('Admin'), ctrl.deleteService);
//parts routes
router.get('/parts', rbac('Admin', 'Tech', 'Advisor', 'Customer'), ctrl.listParts);
router.post('/parts', rbac('Admin'), ctrl.createPart);
router.put('/parts/:id', rbac('Admin'), ctrl.updatePart);
router.delete('/parts/:id', rbac('Admin'), ctrl.deletePart);

module.exports = router;
