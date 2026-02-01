/**
 * Vehicles Controller - Slim version following SOLID
 * Only handles HTTP concerns, delegates to service layer
 */
const vehiclesRepo = require('../repositories/vehicles.repo');
const vehiclesService = require('../services/vehicles.service');

/**
 * Get all vehicles
 * Customer sees only their vehicles (via req.customerId)
 * Advisor/Admin sees all or filtered by query
 */
exports.getAll = async (req, res) => {
    try {
        // req.customerId is set by attachCustomer middleware for Customer role
        const customer_id = req.customerId || req.query.customer_id;

        const vehicles = await vehiclesRepo.findAll({ customer_id });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get vehicle by ID
 */
exports.getById = async (req, res) => {
    try {
        const vehicle = await vehiclesService.getVehicleById(req.params.id, req.customerId);
        res.json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        if (error.message === 'Vehicle not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('only access your own')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Create new vehicle
 */
exports.create = async (req, res) => {
    try {
        let vehicleData = { ...req.body };

        // For Customer role, auto-assign their customer_id
        if (req.customerId) {
            vehicleData.customer_id = req.customerId;
        }

        const vehicle = await vehiclesService.createVehicle(vehicleData);
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        if (error.message.includes('required') ||
            error.message.includes('already exists') ||
            error.message.includes('not found') ||
            error.message.includes('Year must') ||
            error.message.includes('Mileage')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update vehicle
 */
exports.update = async (req, res) => {
    try {
        const vehicle = await vehiclesService.updateVehicle(
            req.params.id,
            req.customerId,
            req.body
        );
        res.json(vehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        if (error.message === 'Vehicle not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('only update your own') ||
            error.message.includes('already exists') ||
            error.message.includes('Year must') ||
            error.message.includes('Mileage')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Delete vehicle
 */
exports.delete = async (req, res) => {
    try {
        await vehiclesService.deleteVehicle(req.params.id, req.customerId);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        if (error.message === 'Vehicle not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('only delete your own')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get service history for a vehicle
 */
exports.getServiceHistory = async (req, res) => {
    try {
        const serviceHistory = await vehiclesService.getVehicleServiceHistory(
            req.params.id,
            req.customerId
        );
        res.json(serviceHistory);
    } catch (error) {
        console.error('Error fetching service history:', error);
        if (error.message === 'Vehicle not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('only access your own')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
