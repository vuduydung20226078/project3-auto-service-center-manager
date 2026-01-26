const customersService = require('../services/customersService');

// Lấy danh sách customers (cho dropdown)
exports.getAll = async (req, res) => {
    try {
        const customers = await customersService.getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết customer
exports.getById = async (req, res) => {
    try {
        const customer = await customersService.getCustomerById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo customer mới (walk-in, không cần user_id)
exports.create = async (req, res) => {
    try {
        const customer = await customersService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        if (error.message.includes('required') || error.message.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật customer
exports.update = async (req, res) => {
    try {
        const customer = await customersService.updateCustomer(req.params.id, req.body);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa customer
exports.delete = async (req, res) => {
    try {
        const customer = await customersService.deleteCustomer(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
