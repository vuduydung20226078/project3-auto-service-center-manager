/**
 * Vehicles Repository
 * Isolates Sequelize queries from service layer
 */
const { Vehicle, Customer, WorkOrder, WorkOrderItem, Service, Part, Booking } = require('../models');

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
        // Try to find vehicle by license plate
        const existingVehicle = await this.findByLicensePlate(vehicleData.license_plate);

        // If vehicle exists
        if (existingVehicle) {
            // Check if it belongs to the same customer
            if (existingVehicle.customer_id === vehicleData.customer_id) {
                // Same customer, reuse vehicle
                return { vehicle: existingVehicle, created: false };
            } else {
                // Different customer - this could be a mistake or shared vehicle issue
                // For now, throw error to prevent data corruption
                throw new Error(
                    `Vehicle with license plate ${vehicleData.license_plate} already registered to another customer. ` +
                    `If this is your vehicle, please contact support.`
                );
            }
        }

        // Create new vehicle
        const vehicle = await this.create(vehicleData, transaction);
        return { vehicle, created: true };
    }

    /**
     * Get service history for a vehicle
     * Returns completed work orders with service items
     */
    async getServiceHistory(vehicleId) {
        const workOrders = await WorkOrder.findAll({
            where: {
                vehicle_id: vehicleId,
                status: ['COMPLETED']
            },
            include: [
                {
                    model: Booking,
                    attributes: ['id', 'scheduled_at', 'status']
                },
                {
                    model: WorkOrderItem,
                    where: { item_type: 'SERVICE' },
                    required: false,
                    include: [
                        {
                            model: Service,
                            as: 'service',
                            attributes: ['id', 'name', 'code']
                        }
                    ]
                }
            ],
            order: [['end_time', 'DESC'], ['created_at', 'DESC']]
        });

        // Transform to service history format
        const serviceHistory = [];

        workOrders.forEach(wo => {
            wo.WorkOrderItems?.forEach(item => {
                serviceHistory.push({
                    id: item.id,
                    service_name: item.service?.name || item.description || 'Unknown Service',
                    service_code: item.service?.code || null,
                    date: wo.end_time || wo.updated_at || wo.created_at,
                    price: parseFloat(item.line_total || 0),
                    work_order_id: wo.id,
                    booking_id: wo.booking_id
                });
            });
        });

        return serviceHistory;
    }
}

module.exports = new VehiclesRepository();
