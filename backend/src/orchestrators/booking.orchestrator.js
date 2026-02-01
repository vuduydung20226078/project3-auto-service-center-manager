/**
 * Booking Orchestrator
 * Coordinates multi-entity booking workflows
 * NO business logic - only orchestration
 */
const { customersRepo, vehiclesRepo, bookingsRepo } = require('../repositories');
const { bookingService } = require('../services');
const { sequelize } = require('../models');

class BookingOrchestrator {
    /**
     * Create booking for customer without login
     * Workflow: Prepare data → Find/Create customer → Find/Create vehicle → Create booking
     */
    async createCustomerBooking({ customerData, vehicleData, scheduled_at, notes }) {
        const transaction = await sequelize.transaction();

        try {
            // Step 1: Prepare customer data (service)
            const preparedCustomerData = bookingService.prepareCustomerData(customerData);

            // Step 2: Find or create customer (repository)
            const { customer, created: customerCreated } = await customersRepo.findOrCreate(
                preparedCustomerData,
                transaction
            );

            // Step 3: Prepare vehicle data (service)
            const preparedVehicleData = bookingService.prepareVehicleData(vehicleData, customer.id);

            // Step 4: Find or create vehicle (repository)
            const { vehicle, created: vehicleCreated } = await vehiclesRepo.findOrCreate(
                preparedVehicleData,
                transaction
            );

            // Step 5: Validate scheduled time (service)
            bookingService.validateScheduledTime(scheduled_at);

            // Step 6: Prepare booking data (service)
            const bookingData = bookingService.prepareBookingData({
                customer_id: customer.id,
                vehicle_id: vehicle.id,
                scheduled_at,
                notes,
                status: 'PENDING'
            });

            // Step 7: Create booking (repository)
            const booking = await bookingsRepo.create(bookingData, transaction);

            await transaction.commit();

            // Step 8: Build metadata response (service)
            const meta = bookingService.buildMetadata({ customerCreated, vehicleCreated });

            return {
                booking,
                customer,
                vehicle,
                meta
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Create booking for authenticated customer
     * Workflow: Validate ownership → Create booking
     */
    async createAuthenticatedCustomerBooking({ customerId, vehicleId, scheduled_at, notes }) {
        // Step 1: Get vehicle (repository)
        const vehicle = await vehiclesRepo.findById(vehicleId);

        // Step 2: Validate ownership (service)
        bookingService.validateVehicleOwnership(vehicle, customerId);

        // Step 3: Validate scheduled time (service)
        bookingService.validateScheduledTime(scheduled_at);

        // Step 4: Prepare booking data (service)
        const bookingData = bookingService.prepareBookingData({
            customer_id: customerId,
            vehicle_id: vehicleId,
            scheduled_at,
            notes,
            status: 'PENDING'
        });

        // Step 5: Create booking (repository)
        return await bookingsRepo.create(bookingData);
    }

    /**
     * Create booking for authenticated customer when vehicle data is provided
     * Workflow: Resolve customer by user_id -> Find or create vehicle -> Create booking
     */
    async createCustomerBookingFromUser({ userId, vehicleData, scheduled_at, notes }) {
        const transaction = await sequelize.transaction();

        try {
            // Step 1: Resolve customer by user id
            const customer = await customersRepo.findByUserId(userId);
            if (!customer) {
                throw new Error('Customer profile not found for authenticated user');
            }

            // Step 2: Prepare and find/create vehicle linked to this customer
            const preparedVehicleData = bookingService.prepareVehicleData(vehicleData, customer.id);
            const { vehicle, created: vehicleCreated } = await vehiclesRepo.findOrCreate(preparedVehicleData, transaction);

            // Step 3: Validate scheduled time
            bookingService.validateScheduledTime(scheduled_at);

            // Step 4: Prepare booking data and create booking
            const bookingData = bookingService.prepareBookingData({
                customer_id: customer.id,
                vehicle_id: vehicle.id,
                scheduled_at,
                notes,
                status: 'PENDING'
            });

            const booking = await bookingsRepo.create(bookingData, transaction);

            await transaction.commit();

            const meta = bookingService.buildMetadata({ customerCreated: false, vehicleCreated });

            return { booking, customer, vehicle, meta };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Cancel booking
     * Workflow: Get booking → Validate cancellation → Update status
     */
    async cancelBooking(bookingId) {
        // Step 1: Get booking (repository)
        const booking = await bookingsRepo.findById(bookingId);

        // Step 2: Validate cancellation (service)
        bookingService.canCancelBooking(booking);

        // Step 3: Update status (repository)
        return await bookingsRepo.updateStatus(bookingId, 'CANCELLED');
    }

    /**
     * Confirm booking (Advisor/Admin only)
     * Workflow: Get booking → Validate confirmation → Update status
     */
    async confirmBooking(bookingId) {
        // Step 1: Get booking (repository)
        const booking = await bookingsRepo.findById(bookingId);

        // Step 2: Validate confirmation (service)
        bookingService.canConfirmBooking(booking);

        // Step 3: Update status (repository)
        return await bookingsRepo.updateStatus(bookingId, 'CONFIRMED');
    }
}

module.exports = new BookingOrchestrator();

