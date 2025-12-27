import api from './api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const inventoryApi = {
    async getAll() {
        try {
            const response = await api.get('/stocks', getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory:', error.response?.data || error.message);
            throw error;
        }
    },

    async getLowStock() {
        try {
            const response = await api.get('/stocks/low', getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching low stock:', error.response?.data || error.message);
            throw error;
        }
    },

    async addEntry(data) {
        try {
            console.log('Adding stock entry:', data);
            const response = await api.post('/stocks/entries', data, getAuthHeaders());
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
    }
};
