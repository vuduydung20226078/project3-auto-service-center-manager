const vehiclesService = require('../services/vehiclesService');

// Lấy danh sách vehicles (có thể filter theo customer_id)
exports.getAll = async (req, res) => {
    try {
        const { customer_id } = req.query;
        const vehicles = await vehiclesService.getAllVehicles({ customer_id });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết vehicle
exports.getById = async (req, res) => {
    try {
        const vehicle = await vehiclesService.getVehicleById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo vehicle mới
exports.create = async (req, res) => {
    try {
        const vehicle = await vehiclesService.createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        if (error.message.includes('required') || error.message.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật vehicle
exports.update = async (req, res) => {
    try {
        const vehicle = await vehiclesService.updateVehicle(req.params.id, req.body);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa vehicle
exports.delete = async (req, res) => {
    try {
        const vehicle = await vehiclesService.deleteVehicle(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
