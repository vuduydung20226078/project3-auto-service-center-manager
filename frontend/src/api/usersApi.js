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
        const response = await api.get('/users', getAuthHeaders());
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/users/${id}`, getAuthHeaders());
        return response.data;
    },

    async update(id, data) {
        const response = await api.put(`/users/${id}`, data, getAuthHeaders());
        return response.data;
    },

    async toggleStatus(id, status) {
        const response = await api.patch(`/users/${id}/status`, { status }, getAuthHeaders());
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/users/${id}`, getAuthHeaders());
        return response.data;
    }
};
