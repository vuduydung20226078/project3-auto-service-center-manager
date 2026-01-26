import api from './api';

// Get all bookings with optional filters
export const getAllBookings = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.customer_id) params.append('customer_id', filters.customer_id);
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);

        const response = await api.get(`/bookings${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

// Get single booking by ID
export const getBookingById = async (id) => {
    try {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
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
