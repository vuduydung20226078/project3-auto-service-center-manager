const router = require('express').Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const ctrl = require('../controllers/catalogsController');

//services routes - GET public for customer booking
router.get('/services', ctrl.listServices);
router.post('/services', auth, rbac('Admin'), ctrl.createService);
router.put('/services/:id', auth, rbac('Admin'), ctrl.updateService);
router.delete('/services/:id', auth, rbac('Admin'), ctrl.deleteService);
//parts routes
router.get('/parts', auth, rbac('Admin', 'Tech', 'Advisor', 'Customer'), ctrl.listParts);
router.post('/parts', auth, rbac('Admin'), ctrl.createPart);
router.put('/parts/:id', auth, rbac('Admin'), ctrl.updatePart);
router.delete('/parts/:id', auth, rbac('Admin'), ctrl.deletePart);

module.exports = router;
