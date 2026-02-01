import api from './api';

// Get all bookings with optional filters
export const getAllBookings = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.customer_id) params.append('customer_id', filters.customer_id);
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);

        const response = await api.get(`/bookings${params.toString() ? '?' + params.toString() : ''}`);
        const raw = response.data;
        // Normalize booking shape for frontend components
        const normalize = (b) => ({
            booking_id: b.booking_id || b.id,
            id: b.id,
            customer_id: b.customer_id,
            vehicle_id: b.vehicle_id,
            // API uses `scheduled_at`; frontend expects `scheduled_time`
            scheduled_time: b.scheduled_time || b.scheduled_at,
            status: (function (s) {
                if (!s) return s;
                switch (s.toUpperCase()) {
                    case 'CANCELLED': return 'Cancelled';
                    case 'CONFIRMED': return 'Confirmed';
                    case 'PENDING': return 'Pending';
                    case 'IN_PROGRESS': return 'In Service';
                    case 'IN_SERVICE': return 'In Service';
                    case 'COMPLETED': return 'Completed';
                    default: return s;
                }
            })(b.status),
            notes: b.notes,
            work_order_id: b.work_order_id,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
            // Normalize nested relations to lowercase keys expected by UI
            customer: b.Customer || b.customer || null,
            vehicle: b.Vehicle || b.vehicle || null
        });

        if (Array.isArray(raw)) return raw.map(normalize);
        return normalize(raw);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

// Get single booking by ID
export const getBookingById = async (id) => {
    try {
        const response = await api.get(`/bookings/${id}`);
        const b = response.data;
        // reuse normalization logic for single booking
        const normalize = (b) => ({
            booking_id: b.booking_id || b.id,
            id: b.id,
            customer_id: b.customer_id,
            vehicle_id: b.vehicle_id,
            scheduled_time: b.scheduled_time || b.scheduled_at,
            status: (function (s) {
                if (!s) return s;
                switch (s.toUpperCase()) {
                    case 'CANCELLED': return 'Cancelled';
                    case 'CONFIRMED': return 'Confirmed';
                    case 'PENDING': return 'Pending';
                    case 'IN_PROGRESS': return 'In Service';
                    case 'IN_SERVICE': return 'In Service';
                    case 'COMPLETED': return 'Completed';
                    default: return s;
                }
            })(b.status),
            notes: b.notes,
            work_order_id: b.work_order_id,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
            customer: b.Customer || b.customer || null,
            vehicle: b.Vehicle || b.vehicle || null
        });

        return normalize(b);
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
};

// Create new booking
export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

// Create customer booking (smart endpoint - finds or creates customer & vehicle)
export const createCustomerBooking = async ({ customerData, vehicleData, scheduled_at, notes, selectedServices }) => {
    try {
        const response = await api.post('/bookings/customer-booking', {
            customerData,
            vehicleData,
            scheduled_at,
            notes,
            selectedServices
        });
        return response.data;
    } catch (error) {
        console.error('Error creating customer booking:', error);
        throw error;
    }
};

// Confirm booking
export const confirmBooking = async (id) => {
    try {
        const response = await api.put(`/bookings/${id}/confirm`);
        return response.data;
    } catch (error) {
        console.error('Error confirming booking:', error);
        throw error;
    }
};

// Cancel booking
export const cancelBooking = async (id) => {
    try {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};
