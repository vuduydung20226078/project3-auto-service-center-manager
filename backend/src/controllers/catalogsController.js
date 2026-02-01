const { catalogsRepo } = require('../repositories');

// Services
exports.listServices = async (req, res) => {
    try {
        const rows = await catalogsRepo.findAllServices();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.createService = async (req, res) => {
    try {
        const { code, name, price, description, duration_minutes, active } = req.body;
        const row = await catalogsRepo.createService({ code, name, price, description, duration_minutes, active });
        res.status(201).json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await catalogsRepo.updateService(id, req.body);
        if (!row) return res.status(404).json({ message: 'Service not found' });
        res.json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const deleted = await catalogsRepo.deleteService(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Service not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Parts
exports.listParts = async (req, res) => {
    try {
        const rows = await catalogsRepo.findAllParts();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.createPart = async (req, res) => {
    try {
        const { sku, name, unit_price, unit, active } = req.body;
        const row = await catalogsRepo.createPart({ sku, name, unit_price, unit, active });
        res.status(201).json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updatePart = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await catalogsRepo.updatePart(id, req.body);
        if (!row) return res.status(404).json({ message: 'Part not found' });
        res.json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deletePart = async (req, res) => {
    try {
        const deleted = await catalogsRepo.deletePart(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Part not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
