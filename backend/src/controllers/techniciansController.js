const techniciansService = require('../services/techniciansService');

// Lấy danh sách technicians
exports.list = async (req, res) => {
    try {
        const technicians = await techniciansService.listTechnicians();
        res.json(technicians);
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy technician theo ID
exports.get = async (req, res) => {
    const { id } = req.params;
    try {
        const technician = await techniciansService.getTechnicianById(id);
        if (!technician) return res.status(404).json({ message: 'Technician not found' });
        res.json(technician);
    } catch (error) {
        console.error('Error fetching technician:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo technician mới
exports.create = async (req, res) => {
    const { user_id } = req.body;
    try {
        const technician = await techniciansService.createTechnician(user_id);
        res.status(201).json(technician);
    } catch (error) {
        console.error('Error creating technician:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật trạng thái technician
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const technician = await techniciansService.updateTechnicianStatus(id, status);
        res.json(technician);
    } catch (error) {
        console.error('Error updating technician status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa technician
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await techniciansService.deleteTechnician(id);
        if (!deleted) return res.status(404).json({ message: 'Technician not found' });
        res.json({ message: 'Technician deleted successfully' });
    } catch (error) {
        console.error('Error deleting technician:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = exports;
