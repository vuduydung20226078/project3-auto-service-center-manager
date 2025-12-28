import api from './api';

export const partsApi = {
    // Get all parts
    async getAll() {
        try {
            const response = await api.get('/catalogs/parts');
            return response.data;
        } catch (error) {
            console.error('Error fetching parts:', error);
            throw error;
        }
    },

    // Get part by ID
    async getById(id) {
        try {
            const response = await api.get(`/catalogs/parts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching part:', error);
            throw error;
        }
    },

    // Create part
    async create(data) {
        try {
            const response = await api.post('/catalogs/parts', data);
            return response.data;
        } catch (error) {
            console.error('Error creating part:', error);
            throw error;
        }
    },

    // Update part
    async update(id, data) {
        try {
            const response = await api.put(`/catalogs/parts/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating part:', error);
            throw error;
        }
    },

    // Delete part
    async delete(id) {
        try {
            await api.delete(`/catalogs/parts/${id}`);
        } catch (error) {
            console.error('Error deleting part:', error);
            throw error;
        }
    }
};
