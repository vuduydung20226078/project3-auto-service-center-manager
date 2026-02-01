const { techniciansRepo } = require('../repositories');
const { techniciansService } = require('../services');

// Lấy danh sách technicians
exports.list = async (req, res) => {
    try {
        const available_only = req.query.available === 'true';
        const technicians = await techniciansRepo.findAll({ available_only });
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
        const technician = await techniciansRepo.findById(id);
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
        const technician = await techniciansRepo.create({ user_id, status: 'AVAILABLE' });
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
        const is_available = status === 'AVAILABLE';
        const technician = await techniciansRepo.updateAvailability(id, is_available);
        if (!technician) return res.status(404).json({ message: 'Technician not found' });
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
        const deleted = await techniciansRepo.delete(id);
        if (!deleted) return res.status(404).json({ message: 'Technician not found' });
        res.json({ message: 'Technician deleted successfully' });
    } catch (error) {
        console.error('Error deleting technician:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 🔥 Get available technicians for a time slot
exports.getAvailable = async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({
            message: 'start and end query parameters are required'
        });
    }

    try {
        const startTime = new Date(start);
        const endTime = new Date(end);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const technicians = await techniciansService.getAvailableTechnicians(startTime, endTime);
        res.json(technicians);
    } catch (error) {
        console.error('Error getting available technicians:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 🔥 Get technician schedule
exports.getSchedule = async (req, res) => {
    const { id } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({
            message: 'from and to query parameters are required'
        });
    }

    try {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const schedule = await techniciansService.getTechnicianSchedule(id, fromDate, toDate);
        res.json(schedule);
    } catch (error) {
        console.error('Error getting technician schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = exports;
