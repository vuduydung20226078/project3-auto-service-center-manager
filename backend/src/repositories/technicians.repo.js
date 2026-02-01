/**
 * Technicians Repository
 * Isolates Sequelize queries from service layer
 */
const { Technician, User } = require('../models');

class TechniciansRepository {
    /**
     * Create a new technician
     */
    async create(data, transaction = null) {
        return await Technician.create(data, { transaction });
    }

    /**
     * Find technician by ID
     */
    async findById(id) {
        return await Technician.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'full_name', 'email', 'phone'] }
            ]
        });
    }

    /**
     * Find technician by user_id
     */
    async findByUserId(user_id) {
        return await Technician.findOne({
            where: { user_id },
            include: [
                { model: User, attributes: ['id', 'full_name', 'email', 'phone'] }
            ]
        });
    }

    /**
     * Find all technicians
     */
    async findAll({ available_only } = {}) {
        const where = {};

        if (available_only) {
            where.status = 'AVAILABLE';
        }

        return await Technician.findAll({
            where,
            include: [
                { model: User, attributes: ['id', 'full_name'] }
            ],
            order: [[User, 'full_name', 'ASC']]
        });
    }

    /**
     * Update technician
     */
    async update(id, data, transaction = null) {
        const technician = await Technician.findByPk(id);
        if (!technician) return null;

        await technician.update(data, { transaction });
        return technician;
    }

    /**
     * Update technician availability
     */
    async updateAvailability(id, available, transaction = null) {
        const technician = await Technician.findByPk(id);
        if (!technician) return null;

        const status = available ? 'AVAILABLE' : 'BUSY';
        await technician.update({ status }, { transaction });
        return technician;
    }

    /**
     * Delete technician
     */
    async delete(id, transaction = null) {
        const technician = await Technician.findByPk(id);
        if (!technician) return null;

        await technician.destroy({ transaction });
        return technician;
    }
}

module.exports = new TechniciansRepository();
