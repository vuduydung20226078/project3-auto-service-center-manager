const { customersRepo } = require('../repositories');

// Get authenticated customer's own profile (via user_id)
exports.getMe = async (req, res) => {
    try {
        // req.user.id comes from auth middleware (JWT user)
        const customer = await customersRepo.findByUserId(req.user.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer profile not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy danh sách customers (cho dropdown)
exports.getAll = async (req, res) => {
    try {
        const customers = await customersRepo.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết customer
exports.getById = async (req, res) => {
    try {
        const customer = await customersRepo.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo customer mới (walk-in, không cần user_id)
exports.create = async (req, res) => {
    try {
        const customer = await customersRepo.create(req.body);
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
        const customer = await customersRepo.update(req.params.id, req.body);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Partial update of the authenticated customer's profile (PATCH /me)
exports.patchMe = async (req, res) => {
    try {
        const customer = await customersRepo.findByUserId(req.user.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer profile not found' });
        }

        // Prevent changing protected fields via this endpoint if necessary
        const allowed = ['name', 'phone', 'address', 'note'];
        const patchData = {};
        Object.keys(req.body).forEach(key => {
            if (allowed.includes(key)) patchData[key] = req.body[key];
        });

        if (Object.keys(patchData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updated = await customersRepo.update(customer.id, patchData);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa customer
exports.delete = async (req, res) => {
    try {
        const deleted = await customersRepo.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Customer not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
