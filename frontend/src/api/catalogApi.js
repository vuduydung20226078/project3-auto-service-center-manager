import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log(token);
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
};

// Services API
export const servicesApi = {
    /**
     * Get all services
     */
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/catalogs/services`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    /**
     * Create a new service
     */
    create: async (data) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/catalogs/services`,
                data,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error creating service:', {
                request: data,
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    /**
     * Update a service
     */
    update: async (id, data) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/catalogs/services/${id}`,
                data,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating service ${id}:`, {
                request: data,
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    /**
     * Delete a service
     */
    delete: async (id) => {
        try {
            await axios.delete(
                `${API_BASE_URL}/catalogs/services/${id}`,
                getAuthHeaders()
            );
        } catch (error) {
            console.error(`Error deleting service ${id}:`, {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },
};

// Parts API
export const partsApi = {
    /**
     * Get all parts
     */
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/catalogs/parts`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching parts:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    /**
     * Create a new part
     */
    create: async (data) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/catalogs/parts`,
                data,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error creating part:', {
                request: data,
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    /**
     * Update a part
     */
    update: async (id, data) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/catalogs/parts/${id}`,
                data,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating part ${id}:`, {
                request: data,
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    /**
     * Delete a part
     */
    delete: async (id) => {
        try {
            await axios.delete(
                `${API_BASE_URL}/catalogs/parts/${id}`,
                getAuthHeaders()
            );
        } catch (error) {
            console.error(`Error deleting part ${id}:`, {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },
};
