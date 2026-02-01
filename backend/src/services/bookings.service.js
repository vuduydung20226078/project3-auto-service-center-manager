/**
 * Bookings Service
 * Business logic for bookings
 */
const bookingsRepo = require('../repositories/bookings.repo');

class BookingsService {
    /**
     * Get booking details with all related data
     * Includes: Customer, Vehicle, WorkOrder (with items, services, parts, technician)
     */
    async getBookingDetails(bookingId, customerId = null) {
        const booking = await bookingsRepo.findByIdDetailed(bookingId);

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Verify ownership for Customer role
        if (customerId && booking.customer_id !== customerId) {
            throw new Error('You can only access your own bookings');
        }

        return booking;
    }
}

module.exports = new BookingsService();
