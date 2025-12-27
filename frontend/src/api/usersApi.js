import api from './api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const usersApi = {
    async getAll() {
        try {
            const response = await api.get('/users', getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/users/${id}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await api.put(`/users/${id}`, data, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error(`Error updating user ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    async toggleStatus(id, status) {
        try {
            const response = await api.patch(`/users/${id}/status`, { status }, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error(`Error toggling user ${id} status:`, error.response?.data || error.message);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await api.delete(`/users/${id}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error(`Error deleting user ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }
};
