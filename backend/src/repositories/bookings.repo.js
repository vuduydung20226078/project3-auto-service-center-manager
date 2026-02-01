/**
 * Bookings Repository
 * Isolates Sequelize queries from service layer
 * Follows Repository pattern for easier testing and ORM swapping
 */
const { Booking, Customer, Vehicle, WorkOrder, WorkOrderItem, Service, Part, Technician, User } = require('../models');
const { Op } = require('sequelize');

class BookingsRepository {
    /**
     * Create a new booking
     */
    async create(data, transaction = null) {
        return await Booking.create(data, { transaction });
    }

    /**
     * Find booking by ID with related data
     */
    async findById(id) {
        return await Booking.findByPk(id, {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'phone', 'email']
                },
                {
                    model: Vehicle,
                    attributes: ['id', 'license_plate', 'make', 'model', 'year']
                }
            ]
        });
    }

    /**
     * Find booking by ID with detailed related data including work order
     * Used for booking details page
     */
    async findByIdDetailed(id) {
        return await Booking.findByPk(id, {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'phone', 'email', 'address']
                },
                {
                    model: Vehicle,
                    attributes: ['id', 'license_plate', 'make', 'model', 'year', 'vin']
                },
                {
                    model: WorkOrder,
                    include: [
                        {
                            model: WorkOrderItem,
                            include: [
                                {
                                    model: Service,
                                    as: 'service',
                                    attributes: ['id', 'code', 'name', 'description', 'price']
                                },
                                {
                                    model: Part,
                                    as: 'part',
                                    attributes: ['id', 'sku', 'name', 'unit_price', 'unit']
                                }
                            ]
                        },
                        {
                            model: Technician,
                            include: [
                                {
                                    model: User,
                                    attributes: ['id', 'full_name', 'phone']
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }

    /**
     * Find all bookings with filters
     */
    async findAll({ customer_id, from, to } = {}) {
        const where = {};

        if (customer_id) {
            where.customer_id = customer_id;
        }

        if (from || to) {
            where.scheduled_at = {};
            if (from) where.scheduled_at[Op.gte] = new Date(from);
            if (to) where.scheduled_at[Op.lte] = new Date(to);
        }

        return await Booking.findAll({
            where,
            order: [['scheduled_at', 'ASC']],
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'phone', 'email']
                },
                {
                    model: Vehicle,
                    attributes: ['id', 'license_plate', 'make', 'model', 'year']
                }
            ]
        });
    }

    /**
     * Update booking status
     */
    async updateStatus(id, status, transaction = null) {
        const booking = await Booking.findByPk(id);
        if (!booking) return null;

        await booking.update({ status }, { transaction });
        return booking;
    }

    /**
     * Update booking
     */
    async update(id, data, transaction = null) {
        const booking = await Booking.findByPk(id);
        if (!booking) return null;

        await booking.update(data, { transaction });
        return booking;
    }

    /**
     * Delete booking
     */
    async delete(id, transaction = null) {
        const booking = await Booking.findByPk(id);
        if (!booking) return null;

        await booking.destroy({ transaction });
        return booking;
    }
}

module.exports = new BookingsRepository();
