import api from './api';

export const dashboardApi = {
    async getSummary() {
        try {
            const response = await api.get('/dashboard/summary');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard summary:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    async getStockStats() {
        try {
            const response = await api.get('/dashboard/stock-stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching stock stats:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    async getStockMovement() {
        try {
            const response = await api.get('/dashboard/stock-movement');
            return response.data;
        } catch (error) {
            console.error('Error fetching stock movement:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    async getTopLowStock(limit = 10) {
        try {
            const response = await api.get(`/dashboard/top-low-stock?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching top low stock:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    async getRecentEntries(limit = 10) {
        try {
            const response = await api.get(`/dashboard/recent-entries?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent entries:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    }
};
