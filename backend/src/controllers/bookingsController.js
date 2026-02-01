/**
 * Bookings Controller - Slim version following SOLID
 * Only handles HTTP concerns, delegates to orchestrator/repo
 */
const bookingOrchestrator = require('../orchestrators/booking.orchestrator');
const bookingsRepo = require('../repositories/bookings.repo');
const bookingsService = require('../services/bookings.service');

/**
 * Create booking for authenticated user
 */
exports.create = async (req, res) => {
    try {
        const { vehicle_id, vehicleData, scheduled_at, notes } = req.body;

        // customerId is set by attachCustomer middleware (derived from req.user.id)
        // Support two flows:
        // 1) vehicle_id provided -> use existing vehicle
        // 2) vehicleData provided -> findOrCreate vehicle for the authenticated customer
        if (vehicle_id) {
            const booking = await bookingOrchestrator.createAuthenticatedCustomerBooking({
                customerId: req.customerId,
                vehicleId: vehicle_id,
                scheduled_at,
                notes
            });
            return res.status(201).json(booking);
        }

        if (vehicleData) {
            const result = await bookingOrchestrator.createCustomerBookingFromUser({
                userId: req.user.id,
                vehicleData,
                scheduled_at,
                notes
            });

            return res.status(201).json({
                success: true,
                booking: result.booking,
                customer: result.customer,
                vehicle: result.vehicle,
                meta: result.meta
            });
        }

        return res.status(400).json({ message: 'vehicle_id or vehicleData is required' });
    } catch (error) {
        if (error.message.includes('not found') || error.message.includes('does not belong')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Create booking for customer without login (public)
 */
exports.createCustomerBooking = async (req, res) => {
    try {
        const { customerData, vehicleData, scheduled_at, notes } = req.body;

        const result = await bookingOrchestrator.createCustomerBooking({
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

/**
 * List bookings
 * Customer sees only their bookings (via req.customerId)
 * Advisor/Admin sees all or filtered by query
 */
exports.list = async (req, res) => {
    try {
        const { from, to } = req.query;

        // req.customerId is set by attachCustomer middleware for Customer role
        // For Advisor/Admin, req.customerId is undefined, so they see all
        const customer_id = req.customerId || req.query.customer_id;

        const bookings = await bookingsRepo.findAll({ customer_id, from, to });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get booking by ID
 * Ownership checked by middleware for Customer role
 */
exports.getById = async (req, res) => {
    try {
        const booking = await bookingsService.getBookingDetails(
            req.params.id,
            req.customerId // Will be set by attachCustomer middleware for Customer role
        );

        res.json(booking);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('You can only access')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Confirm booking (Advisor/Admin only - enforced by rbac middleware)
 */
exports.confirm = async (req, res) => {
    try {
        const booking = await bookingOrchestrator.confirmBooking(req.params.id);
        res.json(booking);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Cannot')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Cancel booking
 */
exports.cancel = async (req, res) => {
    try {
        const booking = await bookingOrchestrator.cancelBooking(req.params.id);
        res.json(booking);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Cannot')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
