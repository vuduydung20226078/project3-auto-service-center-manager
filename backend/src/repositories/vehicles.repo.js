/**
 * Vehicles Repository
 * Isolates Sequelize queries from service layer
 */
const { Vehicle, Customer } = require('../models');

class VehiclesRepository {
    /**
     * Create a new vehicle
     */
    async create(data, transaction = null) {
        return await Vehicle.create(data, { transaction });
    }

    /**
     * Find vehicle by ID
     */
    async findById(id) {
        return await Vehicle.findByPk(id, {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'phone']
                }
            ]
        });
    }

    /**
     * Find vehicle by license plate
     */
    async findByLicensePlate(licensePlate) {
        return await Vehicle.findOne({
            where: { license_plate: licensePlate }
        });
    }

    /**
     * Find all vehicles with optional customer filter
     */
    async findAll({ customer_id } = {}) {
        const where = {};
        if (customer_id) {
            where.customer_id = customer_id;
        }

        return await Vehicle.findAll({
            where,
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name']
                }
            ],
            order: [['license_plate', 'ASC']]
        });
    }

    /**
     * Update vehicle
     */
    async update(id, data, transaction = null) {
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) return null;

        await vehicle.update(data, { transaction });
        return vehicle;
    }

    /**
     * Delete vehicle
     */
    async delete(id, transaction = null) {
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) return null;

        await vehicle.destroy({ transaction });
        return vehicle;
    }

    /**
     * Find or create vehicle
     */
    async findOrCreate(vehicleData, transaction = null) {
        const [vehicle, created] = await Vehicle.findOrCreate({
            where: { license_plate: vehicleData.license_plate },
            defaults: vehicleData,
            transaction
        });

        return { vehicle, created };
    }
}

module.exports = new VehiclesRepository();
