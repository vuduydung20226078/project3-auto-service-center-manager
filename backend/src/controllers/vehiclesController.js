const { Vehicle, Customer } = require('../models');

// Lấy danh sách vehicles (có thể filter theo customer_id)
exports.getAll = async (req, res) => {
    try {
        const { customer_id } = req.query;
        const where = customer_id ? { customer_id } : {};

        const vehicles = await Vehicle.findAll({
            where,
            include: [
                { model: Customer, attributes: ['id', 'name'] }
            ],
            order: [['license_plate', 'ASC']]
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết vehicle
exports.getById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id, {
            include: [
                { model: Customer, attributes: ['id', 'name', 'phone'] }
            ]
        });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo vehicle mới
exports.create = async (req, res) => {
    const { customer_id, license_plate, model, vin, mileage, note } = req.body;
    try {
        if (!customer_id || !license_plate) {
            return res.status(400).json({ message: 'Customer and license plate are required' });
        }

        const vehicle = await Vehicle.create({
            customer_id,
            license_plate,
            model,
            vin,
            mileage,
            note
        });

        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật vehicle
exports.update = async (req, res) => {
    const { license_plate, model, vin, mileage, note } = req.body;
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        await vehicle.update({ license_plate, model, vin, mileage, note });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa vehicle
exports.delete = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        await vehicle.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
