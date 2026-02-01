/**
 * Users Repository
 * Isolates Sequelize queries from service layer
 */
const { User, Role } = require('../models');

class UsersRepository {
    /**
     * Create a new user
     */
    async create(data, transaction = null) {
        return await User.create(data, { transaction });
    }

    /**
     * Find user by ID
     */
    async findById(id) {
        return await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ],
            attributes: { exclude: ['password'] }
        });
    }

    /**
     * Find user by email
     */
    async findByEmail(email) {
        return await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    /**
     * Find user by username
     */
    async findByUsername(username) {
        return await User.findOne({
            where: { username },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    /**
     * Find user by email (with password for auth)
     */
    async findByEmailWithPassword(email) {
        return await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    /**
     * Find all users
     */
    async findAll() {
        return await User.findAll({
            include: [
                {
                    model: Role,
                    attributes: ['id', 'name']
                }
            ],
            attributes: { exclude: ['password'] },
            order: [['username', 'ASC']]
        });
    }

    /**
     * Update user
     */
    async update(id, data, transaction = null) {
        const user = await User.findByPk(id);
        if (!user) return null;

        await user.update(data, { transaction });
        return user;
    }

    /**
     * Update user status
     */
    async updateStatus(id, status, transaction = null) {
        const user = await User.findByPk(id);
        if (!user) return null;

        await user.update({ status }, { transaction });
        return user;
    }

    /**
     * Delete user
     */
    async delete(id, transaction = null) {
        const user = await User.findByPk(id);
        if (!user) return null;

        await user.destroy({ transaction });
        return user;
    }

    /**
     * Update refresh token
     */
    async updateRefreshToken(userId, refreshToken, expiresAt, transaction = null) {
        const { RefreshToken } = require('../models');

        // Create refresh token record
        return await RefreshToken.create({
            user_id: userId,
            token: refreshToken,
            expires_at: expiresAt
        }, { transaction });
    }
}

module.exports = new UsersRepository();
