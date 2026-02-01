/**
 * Booking Service
 * Business logic for booking operations
 * Handles validation, business rules, data transformation
 * NO database access - delegates to repositories via orchestrator
 */

class BookingService {
    /**
     * Validate vehicle ownership
     * Business Rule: Vehicle must belong to the customer
     */
    validateVehicleOwnership(vehicle, customerId) {
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        if (vehicle.customer_id !== customerId) {
            throw new Error('Vehicle does not belong to customer');
        }

        return true;
    }

    /**
     * Can cancel booking?
     * Business Rule: Cannot cancel completed bookings
     */
    canCancelBooking(booking) {
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === 'COMPLETED') {
            throw new Error('Cannot cancel completed booking');
        }

        return true;
    }

    /**
     * Can confirm booking?
     * Business Rule: Cannot confirm cancelled bookings
     */
    canConfirmBooking(booking) {
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === 'CANCELLED') {
            throw new Error('Cannot confirm cancelled booking');
        }

        return true;
    }

    /**
     * Prepare booking data for creation
     * Data Transformation: Standardize booking input
     */
    prepareBookingData({ customer_id, vehicle_id, scheduled_at, notes, status = 'PENDING' }) {
        return {
            customer_id,
            vehicle_id,
            scheduled_at,
            notes,
            status
        };
    }

    /**
     * Validate scheduled time
     * Business Rule: Booking must be in the future
     */
    validateScheduledTime(scheduled_at) {
        const scheduledDate = new Date(scheduled_at);
        const now = new Date();

        if (scheduledDate < now) {
            throw new Error('Scheduled time must be in the future');
        }

        return true;
    }

    /**
     * Prepare customer data with defaults
     */
    prepareCustomerData(rawData) {
        return {
            name: rawData.name?.trim(),
            phone: rawData.phone?.trim(),
            email: rawData.email?.trim() || null,
            address: rawData.address?.trim() || null
        };
    }

    /**
     * Prepare vehicle data with defaults
     */
    prepareVehicleData(rawData, customer_id) {
        return {
            customer_id,
            license_plate: rawData.license_plate?.trim().toUpperCase(),
            make: rawData.make?.trim(),
            model: rawData.model?.trim(),
            year: rawData.year ? parseInt(rawData.year, 10) : null,
            mileage: rawData.mileage ? parseInt(rawData.mileage, 10) : null,
            vin: rawData.vin?.trim() || null,
            color: rawData.color?.trim() || null,
            note: rawData.note?.trim() || null
        };
    }

    /**
     * Build response metadata
     */
    buildMetadata({ customerCreated, vehicleCreated }) {
        return {
            customerCreated,
            vehicleCreated,
            message: this.getCreationMessage(customerCreated, vehicleCreated)
        };
    }

    /**
     * Get user-friendly creation message
     */
    getCreationMessage(customerCreated, vehicleCreated) {
        if (customerCreated && vehicleCreated) {
            return 'New customer and vehicle registered, booking created';
        }
        if (customerCreated) {
            return 'New customer registered, booking created';
        }
        if (vehicleCreated) {
            return 'New vehicle registered, booking created';
        }
        return 'Booking created for existing customer and vehicle';
    }
}

module.exports = new BookingService();
