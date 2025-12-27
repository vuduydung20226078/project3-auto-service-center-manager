import api from './api';

// Services API
export const servicesApi = {
    /**
     * Get all services
     */
    getAll: async () => {
        try {
            const response = await api.get('/catalogs/services');
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
            const response = await api.post('/catalogs/services', data);
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
            const response = await api.put(`/catalogs/services/${id}`, data);
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
            await api.delete(`/catalogs/services/${id}`);
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
            const response = await api.get('/catalogs/parts');
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
            const response = await api.post('/catalogs/parts', data);
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
            const response = await api.put(`/catalogs/parts/${id}`, data);
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
            await api.delete(`/catalogs/parts/${id}`);
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
