import api from './api';

export const inventoryApi = {
    async getAll() {
        try {
            const response = await api.get('/stocks');
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory:', error.response?.data || error.message);
            throw error;
        }
    },

    async getLowStock() {
        try {
            const response = await api.get('/stocks/low');
            return response.data;
        } catch (error) {
            console.error('Error fetching low stock:', error.response?.data || error.message);
            throw error;
        }
    },

    async addEntry(data) {
        try {
            console.log('Adding stock entry:', data);
            const response = await api.post('/stocks/entries', data);
            return response.data;
        } catch (error) {
            console.error('Error adding stock entry:', {
                request: data,
                response: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            throw error;
        }
    },

    async deleteStock(part_id, location) {
        try {
            console.log('Deleting stock:', { part_id, location });
            const response = await api.delete(`/stocks/${part_id}/${encodeURIComponent(location)}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting stock:', {
                part_id,
                location,
                response: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            throw error;
        }
    }
};
