const bookingsService = require('../services/bookingsService');  // Import service

exports.create = async (req, res) => {
    try {
        const { customer_id, vehicle_id, scheduled_at, notes } = req.body;
        const row = await bookingsService.createBooking({ customer_id, vehicle_id, scheduled_at, notes });
        res.status(201).json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * Create booking for customer without login
 * Accepts customerData and vehicleData in request body
 */
exports.createCustomerBooking = async (req, res) => {
    try {
        const { customerData, vehicleData, scheduled_at, notes, selectedServices } = req.body;

        const result = await bookingsService.createCustomerBooking({
            customerData,
            vehicleData,
            scheduled_at,
            notes
        });

        res.status(201).json({
            success: true,
            booking: result.booking,
            customer: result.customer,
            vehicle: result.vehicle,
            meta: result.meta
        });
    } catch (error) {
        if (error.message.includes('required') || error.message.includes('already registered')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.list = async (req, res) => {
    try {
        const { customer_id, from, to } = req.query;
        const rows = await bookingsService.listBookings({ customer_id, from, to });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getById = async (req, res) => {
    try {
        const row = await bookingsService.getBookingById(req.params.id);
        if (!row) return res.status(404).json({ message: 'Booking not found' });
        res.json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.confirm = async (req, res) => {
    try {
        const row = await bookingsService.confirmBooking(req.params.id);
        if (!row) return res.status(404).json({ message: 'Not found' });
        res.json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.cancel = async (req, res) => {
    try {
        const row = await bookingsService.cancelBooking(req.params.id);
        if (!row) return res.status(404).json({ message: 'Not found' });
        res.json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
