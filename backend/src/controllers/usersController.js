const { usersRepo } = require('../repositories');
const authService = require('../services/auth.service');

const usersController = {
    async getAllUsers(req, res) {
        try {
            const users = await usersRepo.findAll();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Failed to fetch users', error: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await usersRepo.findById(req.params.id);
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
            const user = await usersRepo.update(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user', error: error.message });
        }
    },

    async toggleUserStatus(req, res) {
        try {
            const { status } = req.body;
            const user = await usersRepo.updateStatus(req.params.id, status);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error toggling user status:', error);
            res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const deleted = await usersRepo.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Failed to delete user', error: error.message });
        }
    },

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Old password and new password are required' });
            }

            await authService.changePassword(req.user.id, oldPassword, newPassword);
            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.message === 'Old password is incorrect') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Failed to change password', error: error.message });
        }
    }
};

module.exports = usersController;
