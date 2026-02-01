const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/scheduledController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');

// Apply authentication to all routes
router.use(auth);

// Get technician statistics
router.get('/stats', rbac('Technician'), technicianController.getStats);

// Get work orders
router.get('/work-orders', rbac('Technician'), technicianController.getWorkOrders);

// Get work order detail
router.get('/work-orders/:id', rbac('Technician'), technicianController.getWorkOrderDetail);

// Update work order status
router.patch('/work-orders/:id/status', rbac('Technician'), technicianController.updateWorkOrderStatus);

// Update technician notes
router.patch('/work-orders/:id/notes', rbac('Technician'), technicianController.updateTechnicianNotes);

module.exports = router;
