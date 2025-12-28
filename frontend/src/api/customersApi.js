import api from './api';

export const customersApi = {
    // Get all customers
    async getAll() {
        try {
            const response = await api.get('/customers');
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    // Get customer by ID
    async getById(id) {
        try {
            const response = await api.get(`/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    },

    // Create new customer
    async create(data) {
        try {
            const response = await api.post('/customers', data);
            return response.data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    // Update customer
    async update(id, data) {
        try {
            const response = await api.put(`/customers/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    },

    // Delete customer
    async delete(id) {
        try {
            await api.delete(`/customers/${id}`);
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    }
};
