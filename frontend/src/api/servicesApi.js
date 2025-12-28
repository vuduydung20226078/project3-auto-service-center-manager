import api from './api';

export const servicesApi = {
    // Get all services
    async getAll() {
        try {
            const response = await api.get('/catalogs/services');
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    // Get service by ID
    async getById(id) {
        try {
            const response = await api.get(`/catalogs/services/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching service:', error);
            throw error;
        }
    },

    // Create service
    async create(data) {
        try {
            const response = await api.post('/catalogs/services', data);
            return response.data;
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    // Update service
    async update(id, data) {
        try {
            const response = await api.put(`/catalogs/services/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    },

    // Delete service
    async delete(id) {
        try {
            await api.delete(`/catalogs/services/${id}`);
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    }
};
