const usersService = require('../services/usersService');

const usersController = {
    async getAllUsers(req, res) {
        try {
            const users = await usersService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Failed to fetch users', error: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await usersService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Failed to fetch user', error: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await usersService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user', error: error.message });
        }
    },

    async toggleUserStatus(req, res) {
        try {
            const { status } = req.body;
            const user = await usersService.toggleUserStatus(req.params.id, status);
            res.json(user);
        } catch (error) {
            console.error('Error toggling user status:', error);
            res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const result = await usersService.deleteUser(req.params.id);
            res.json(result);
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Failed to delete user', error: error.message });
        }
    }
};

module.exports = usersController;
