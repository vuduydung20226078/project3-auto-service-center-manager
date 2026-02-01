/**
 * Vehicles Controller - Slim version following SOLID
 * Only handles HTTP concerns, delegates to repository
 */
const vehiclesRepo = require('../repositories/vehicles.repo');

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
        const vehicle = await vehiclesRepo.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Verify ownership for Customer role
        if (req.customerId && vehicle.customer_id !== req.customerId) {
            return res.status(403).json({ message: 'You can only access your own vehicles' });
        }

        res.json(vehicle);
    } catch (error) {
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

        // Validation
        if (!vehicleData.customer_id || !vehicleData.license_plate) {
            return res.status(400).json({
                message: 'Customer and license plate are required'
            });
        }

        // Check for duplicate license plate
        const existingVehicle = await vehiclesRepo.findByLicensePlate(vehicleData.license_plate);
        if (existingVehicle) {
            return res.status(400).json({
                message: 'Vehicle with this license plate already exists'
            });
        }

        const vehicle = await vehiclesRepo.create(vehicleData);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update vehicle
 */
exports.update = async (req, res) => {
    try {
        const existingVehicle = await vehiclesRepo.findById(req.params.id);

        if (!existingVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Verify ownership for Customer role
        if (req.customerId && existingVehicle.customer_id !== req.customerId) {
            return res.status(403).json({ message: 'You can only update your own vehicles' });
        }

        // Check for duplicate license plate (excluding current vehicle)
        if (req.body.license_plate && req.body.license_plate !== existingVehicle.license_plate) {
            const duplicateVehicle = await vehiclesRepo.findByLicensePlate(req.body.license_plate);
            if (duplicateVehicle && duplicateVehicle.id !== existingVehicle.id) {
                return res.status(400).json({
                    message: 'Vehicle with this license plate already exists'
                });
            }
        }

        const vehicle = await vehiclesRepo.update(req.params.id, req.body);
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Delete vehicle
 */
exports.delete = async (req, res) => {
    try {
        const existingVehicle = await vehiclesRepo.findById(req.params.id);

        if (!existingVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Verify ownership for Customer role
        if (req.customerId && existingVehicle.customer_id !== req.customerId) {
            return res.status(403).json({ message: 'You can only delete your own vehicles' });
        }

        await vehiclesRepo.delete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
