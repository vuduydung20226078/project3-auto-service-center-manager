const { bookings } = require('../models');

exports.createBooking = async ({ customer_id, vehicle_id, scheduled_at, notes }) => {
    return await bookings.create({ customer_id, vehicle_id, scheduled_at, notes, status: 'PENDING' });
};

exports.listBookings = async ({ customer_id, from, to }) => {
    const where = {};
    if (customer_id) where.customer_id = customer_id;
    if (from || to) where.scheduled_at = { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) };
    return await bookings.findAll({ where, order: [['scheduled_at', 'ASC']] });
};

exports.confirmBooking = async (id) => {
    const row = await bookings.findByPk(id);
    if (row) {
        await row.update({ status: 'CONFIRMED' });
    }
    return row;
};

exports.cancelBooking = async (id) => {
    const row = await bookings.findByPk(id);
    if (row) {
        await row.update({ status: 'CANCELLED' });
    }
    return row;
};
