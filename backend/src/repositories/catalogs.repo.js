/**
 * Catalogs Repository
 * Isolates Sequelize queries from service layer
 */
const { Service, Part } = require('../models');

class CatalogsRepository {
    // ========== Services Catalog ==========

    /**
     * Find all services
     */
    async findAllServices() {
        return await Service.findAll({
            order: [['name', 'ASC']]
        });
    }

    /**
     * Find service by ID
     */
    async findServiceById(id) {
        return await Service.findByPk(id);
    }

    /**
     * Create service
     */
    async createService(data, transaction = null) {
        return await Service.create(data, { transaction });
    }

    /**
     * Update service
     */
    async updateService(id, data, transaction = null) {
        const service = await Service.findByPk(id);
        if (!service) return null;

        await service.update(data, { transaction });
        return service;
    }

    /**
     * Delete service
     */
    async deleteService(id, transaction = null) {
        const service = await Service.findByPk(id);
        if (!service) return null;

        await service.destroy({ transaction });
        return service;
    }

    // ========== Parts Catalog ==========

    /**
     * Find all parts
     */
    async findAllParts() {
        return await Part.findAll({
            order: [['name', 'ASC']]
        });
    }

    /**
     * Find part by ID
     */
    async findPartById(id) {
        return await Part.findByPk(id);
    }

    /**
     * Create part
     */
    async createPart(data, transaction = null) {
        return await Part.create(data, { transaction });
    }

    /**
     * Update part
     */
    async updatePart(id, data, transaction = null) {
        const part = await Part.findByPk(id);
        if (!part) return null;

        await part.update(data, { transaction });
        return part;
    }

    /**
     * Delete part
     */
    async deletePart(id, transaction = null) {
        const part = await Part.findByPk(id);
        if (!part) return null;

        await part.destroy({ transaction });
        return part;
    }
}

module.exports = new CatalogsRepository();
