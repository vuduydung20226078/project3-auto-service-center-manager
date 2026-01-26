const { Booking, Customer, Vehicle } = require('../models');
const customersService = require('./customersService');
const vehiclesService = require('./vehiclesService');

exports.createBooking = async ({ customer_id, vehicle_id, scheduled_at, notes }) => {
    return await Booking.create({ customer_id, vehicle_id, scheduled_at, notes, status: 'PENDING' });
};

/**
 * Create booking for customer without login
 * Handles find-or-create for customer and vehicle
 */
exports.createCustomerBooking = async ({ customerData, vehicleData, scheduled_at, notes }) => {
    // Step 1: Find or create customer
    const { customer, created: customerCreated } = await customersService.findOrCreateCustomer(customerData);

    // Step 2: Find or create vehicle
    const vehicleDataWithCustomer = {
        ...vehicleData,
        customer_id: customer.id
    };
    const { vehicle, created: vehicleCreated } = await vehiclesService.findOrCreateVehicle(vehicleDataWithCustomer);

    // Step 3: Create booking
    const booking = await Booking.create({
        customer_id: customer.id,
        vehicle_id: vehicle.id,
        scheduled_at,
        notes,
        status: 'PENDING'
    });

    // Return complete booking with related data
    return {
        booking,
        customer,
        vehicle,
        meta: {
            customerCreated,
            vehicleCreated
        }
    };
};

exports.getBookingById = async (id) => {
    return await Booking.findByPk(id, {
        include: [
            { model: Customer, attributes: ['id', 'name', 'phone', 'email'] },
            { model: Vehicle, attributes: ['id', 'license_plate', 'make', 'model', 'year'] }
        ]
    });
};

exports.listBookings = async ({ customer_id, from, to }) => {
    const where = {};
    if (customer_id) where.customer_id = customer_id;
    if (from || to) where.scheduled_at = { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };
    return await Booking.findAll({
        where,
        order: [['scheduled_at', 'ASC']],
        include: [
            { model: Customer, attributes: ['id', 'name', 'phone', 'email'] },
            { model: Vehicle, attributes: ['id', 'license_plate', 'make', 'model', 'year'] }
        ]
    });
};

exports.confirmBooking = async (id) => {
    const row = await Booking.findByPk(id);
    if (row) {
        await row.update({ status: 'CONFIRMED' });
    }
    return row;
};

exports.cancelBooking = async (id) => {
    const row = await Booking.findByPk(id);
    if (row) {
        await row.update({ status: 'CANCELLED' });
    }
    return row;
};
