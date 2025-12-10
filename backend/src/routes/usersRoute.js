const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');
const requireRole = require('../middlewares/rbac');

// All routes require authentication and admin role
router.use(verifyToken);
router.use(requireRole('Admin'));

// GET all users
router.get('/', usersController.getAllUsers);

// GET user by ID
router.get('/:id', usersController.getUserById);

// PUT update user
router.put('/:id', usersController.updateUser);

// PATCH toggle user status (activate/deactivate)
router.patch('/:id/status', usersController.toggleUserStatus);

// DELETE user
router.delete('/:id', usersController.deleteUser);

module.exports = router;
