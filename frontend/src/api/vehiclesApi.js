import api from './api';

export const vehiclesApi = {
    // Get all vehicles (optionally filter by customer_id)
    async getAll(params = {}) {
        try {
            const response = await api.get('/vehicles', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            throw error;
        }
    },

    // Get vehicle by ID
    async getById(id) {
        try {
            const response = await api.get(`/vehicles/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle:', error);
            throw error;
        }
    },

    // Create new vehicle
    async create(data) {
        try {
            const response = await api.post('/vehicles', data);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle:', error);
            throw error;
        }
    },

    // Update vehicle
    async update(id, data) {
        try {
            const response = await api.put(`/vehicles/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }
    },

    // Delete vehicle
    async delete(id) {
        try {
            await api.delete(`/vehicles/${id}`);
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            throw error;
        }
    },

    // Get service history for a vehicle
    async getServiceHistory(id) {
        try {
            const response = await api.get(`/vehicles/${id}/service-history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching service history:', error);
            throw error;
        }
    }
};
