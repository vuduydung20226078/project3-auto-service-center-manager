import api from './api';

export const workOrdersApi = {
    // Get all work orders with filters
    async getAll(params = {}) {
        try {
            const query = new URLSearchParams(params).toString();
            const response = await api.get(`/work-orders${query ? `?${query}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching work orders:', error);
            throw error;
        }
    },

    // Get work order by ID
    async getById(id) {
        try {
            const response = await api.get(`/work-orders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching work order ${id}:`, error);
            throw error;
        }
    },

    // Create work order from booking
    async createFromBooking(data) {
        try {
            const response = await api.post('/work-orders/from-booking', data);
            return response.data;
        } catch (error) {
            console.error('Error creating work order:', error);
            throw error;
        }
    },

    // Create direct work order
    async create(data) {
        try {
            const response = await api.post('/work-orders', data);
            return response.data;
        } catch (error) {
            console.error('Error creating work order:', error);
            throw error;
        }
    },

    // Update work order
    async update(id, data) {
        try {
            const response = await api.put(`/work-orders/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating work order ${id}:`, error);
            throw error;
        }
    },

    // Add item (service/part) to work order
    async addItem(workOrderId, item) {
        try {
            const response = await api.post(`/work-orders/${workOrderId}/items`, item);
            return response.data;
        } catch (error) {
            console.error('Error adding item to work order:', error);
            throw error;
        }
    },

    // Assign technician
    async assignTechnician(workOrderId, technicianId) {
        try {
            const response = await api.post(`/work-orders/${workOrderId}/assign`, {
                technician_id: technicianId
            });
            return response.data;
        } catch (error) {
            console.error('Error assigning technician:', error);
            throw error;
        }
    },

    // Update status
    async updateStatus(workOrderId, status) {
        try {
            const response = await api.patch(`/work-orders/${workOrderId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating work order status:', error);
            throw error;
        }
    },

    // Get stats (for StatCards)
    async getStats() {
        try {
            const response = await api.get('/work-orders/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching work order stats:', error);
            throw error;
        }
    },

    // Delete work order
    async delete(id) {
        try {
            await api.delete(`/work-orders/${id}`);
        } catch (error) {
            console.error(`Error deleting work order ${id}:`, error);
            throw error;
        }
    }
};
