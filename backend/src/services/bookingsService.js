const { Booking, Customer, Vehicle } = require('../models');

exports.createBooking = async ({ customer_id, vehicle_id, scheduled_at, notes }) => {
    return await Booking.create({ customer_id, vehicle_id, scheduled_at, notes, status: 'PENDING' });
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
            { model: Vehicle, attributes: ['id', 'license_plate', 'model'] }
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
