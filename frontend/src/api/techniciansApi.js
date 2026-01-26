import api from './api';

export const techniciansApi = {
    // Lấy danh sách technicians
    async getAll() {
        try {
            const response = await api.get('/technicians');
            return response.data;
        } catch (error) {
            console.error('Error fetching technicians:', error);
            throw error;
        }
    },

    // Lấy technician theo ID
    async getById(id) {
        try {
            const response = await api.get(`/technicians/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching technician ${id}:`, error);
            throw error;
        }
    },

    // Tạo technician mới
    async create(data) {
        try {
            const response = await api.post('/technicians', data);
            return response.data;
        } catch (error) {
            console.error('Error creating technician:', error);
            throw error;
        }
    },

    // Cập nhật trạng thái technician
    async updateStatus(id, status) {
        try {
            const response = await api.put(`/technicians/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating technician ${id} status:`, error);
            throw error;
        }
    },

    // Xóa technician
    async delete(id) {
        try {
            const response = await api.delete(`/technicians/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting technician ${id}:`, error);
            throw error;
        }
    },

    // 🔥 Get available technicians for a time slot
    async getAvailable(startTime, endTime) {
        try {
            const response = await api.get('/technicians/available', {
                params: {
                    start: startTime,
                    end: endTime
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching available technicians:', error);
            throw error;
        }
    },

    // 🔥 Get technician schedule
    async getSchedule(technicianId, fromDate, toDate) {
        try {
            const response = await api.get(`/technicians/${technicianId}/schedule`, {
                params: {
                    from: fromDate,
                    to: toDate
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching technician ${technicianId} schedule:`, error);
            throw error;
        }
    }
};
