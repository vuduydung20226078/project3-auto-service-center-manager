import api from './api';

export const invoicesApi = {
    // Get all invoices with optional filters
    getAll: async (params = {}) => {
        const response = await api.get('/billing/invoices', { params });
        return response.data;
    },

    // Get invoice by ID
    getById: async (id) => {
        const response = await api.get(`/billing/invoices/${id}`);
        return response.data;
    },

    // Create new invoice
    create: async (data) => {
        const response = await api.post('/billing/invoices', data);
        return response.data;
    },

    // Update invoice
    update: async (id, data) => {
        const response = await api.put(`/billing/invoices/${id}`, data);
        return response.data;
    },

    // Delete invoice
    delete: async (id) => {
        const response = await api.delete(`/billing/invoices/${id}`);
        return response.data;
    },

    // Update invoice status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/billing/invoices/${id}/status`, { status });
        return response.data;
    },

    // Get invoice statistics
    getStats: async () => {
        const response = await api.get('/billing/invoices-stats');
        return response.data;
    },

    // Get payments for an invoice
    getPayments: async (invoiceId) => {
        const response = await api.get(`/billing/invoices/${invoiceId}/payments`);
        return response.data;
    },

    // Get completed work orders without invoice
    getCompletedWorkOrders: async () => {
        const response = await api.get('/billing/completed-work-orders');
        return response.data;
    },

    // Get work order details for invoice creation
    getWorkOrderDetails: async (workOrderId) => {
        const response = await api.get(`/billing/work-orders/${workOrderId}/details`);
        return response.data;
    }
};
