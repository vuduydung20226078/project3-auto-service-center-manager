import api from './api';

const technicianAPI = {
    // Get work orders
    getWorkOrders: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.date) queryParams.append('date', params.date);

        const response = await api.get(`/technician/work-orders?${queryParams}`);
        return response.data;
    },

    // Get work order detail
    getWorkOrderDetail: async (id) => {
        const response = await api.get(`/technician/work-orders/${id}`);
        return response.data;
    },

    // Update work order status
    updateWorkOrderStatus: async (id, status) => {
        const response = await api.patch(`/technician/work-orders/${id}/status`, { status });
        return response.data;
    },

    // Update technician notes
    updateTechnicianNotes: async (id, notes) => {
        const response = await api.patch(`/technician/work-orders/${id}/notes`, { notes });
        return response.data;
    },

    // Get statistics
    getStats: async () => {
        const response = await api.get('/technician/stats');
        return response.data;
    }
};

export default technicianAPI;
