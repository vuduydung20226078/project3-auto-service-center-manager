const { User, Role } = require('../models');

const usersService = {
    async getAllUsers() {
        const users = await User.findAll({
            attributes: ['id', 'username', 'full_name', 'email', 'phone', 'role_id', 'status', 'created_at', 'updated_at'],
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return users;
    },

    async getUserById(id) {
        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'full_name', 'email', 'phone', 'role_id', 'status', 'created_at', 'updated_at'],
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ]
        });
        return user;
    },

    async updateUser(id, data) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Only allow updating certain fields
        const allowedFields = ['full_name', 'email', 'phone', 'role_id'];
        const updateData = {};

        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        await user.update(updateData);

        return await this.getUserById(id);
    },

    async toggleUserStatus(id, newStatus) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        // newStatus should be 'active' or 'disabled'
        if (!['active', 'disabled'].includes(newStatus)) {
            throw new Error('Invalid status. Must be "active" or "disabled"');
        }

        await user.update({ status: newStatus });

        return await this.getUserById(id);
    },

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        await user.destroy();
        return { message: 'User deleted successfully' };
    }
};

module.exports = usersService;
