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
        const response = await api.get('/stocks', getAuthHeaders());
        return response.data;
    },

    async getLowStock() {
        const response = await api.get('/stocks/low', getAuthHeaders());
        return response.data;
    },

    async addEntry(data) {
        const response = await api.post('/stocks/entries', data, getAuthHeaders());
        return response.data;
    }
};
