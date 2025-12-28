const { Customer, User, Vehicle } = require('../models');

// Lấy danh sách customers (cho dropdown)
exports.getAll = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: ['id', 'name', 'phone', 'email'],
            order: [['name', 'ASC']]
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết customer
exports.getById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [
                { model: Vehicle, attributes: ['id', 'license_plate', 'model'] }
            ]
        });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo customer mới (walk-in, không cần user_id)
exports.create = async (req, res) => {
    const { name, phone, email, address } = req.body;
    try {
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const customer = await Customer.create({
            name,
            phone,
            email,
            address,
            user_id: null // Walk-in customer không có tài khoản
        });

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật customer
exports.update = async (req, res) => {
    const { name, phone, email, address } = req.body;
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        await customer.update({ name, phone, email, address });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa customer
exports.delete = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        await customer.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
