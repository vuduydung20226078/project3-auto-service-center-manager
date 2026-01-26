const { Vehicle, Customer } = require('../models');

/**
 * Get all vehicles with optional customer filter
 */
exports.getAllVehicles = async ({ customer_id } = {}) => {
    const where = customer_id ? { customer_id } : {};

    return await Vehicle.findAll({
        where,
        include: [
            { model: Customer, attributes: ['id', 'name'] }
        ],
        order: [['license_plate', 'ASC']]
    });
};

/**
 * Get vehicle by ID
 */
exports.getVehicleById = async (id) => {
    return await Vehicle.findByPk(id, {
        include: [
            { model: Customer, attributes: ['id', 'name', 'phone'] }
        ]
    });
};

/**
 * Create new vehicle
 */
exports.createVehicle = async (vehicleData) => {
    const { customer_id, license_plate, make, year, model, vin, mileage, note } = vehicleData;

    // Validation
    if (!customer_id || !license_plate) {
        throw new Error('Customer and license plate are required');
    }

    // Check for duplicate license plate
    const existingVehicle = await Vehicle.findOne({ where: { license_plate } });
    if (existingVehicle) {
        throw new Error('Vehicle with this license plate already exists');
    }

    return await Vehicle.create({
        customer_id,
        license_plate,
        make,
        year,
        model,
        vin,
        mileage,
        note
    });
};

/**
 * Update vehicle
 */
exports.updateVehicle = async (id, vehicleData) => {
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
        return null;
    }

    const { license_plate, make, year, model, vin, mileage, note } = vehicleData;

    // Check for duplicate license plate (excluding current vehicle)
    if (license_plate && license_plate !== vehicle.license_plate) {
        const existingVehicle = await Vehicle.findOne({
            where: { license_plate }
        });
        if (existingVehicle && existingVehicle.id !== id) {
            throw new Error('Vehicle with this license plate already exists');
        }
    }

    await vehicle.update({ license_plate, make, year, model, vin, mileage, note });
    return vehicle;
};

/**
 * Delete vehicle
 */
exports.deleteVehicle = async (id) => {
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
        return null;
    }

    await vehicle.destroy();
    return vehicle;
};

/**
 * Get vehicles by customer ID
 */
exports.getVehiclesByCustomer = async (customerId) => {
    return await Vehicle.findAll({
        where: { customer_id: customerId },
        order: [['license_plate', 'ASC']]
    });
};

/**
 * Find or create vehicle (for booking without login)
 * Allows same license plate for different customers (e.g., someone booking on behalf of owner)
 */
exports.findOrCreateVehicle = async (vehicleData) => {
    const { customer_id, license_plate, make, year, model, vin, mileage, note } = vehicleData;

    // Validation
    if (!customer_id || !license_plate) {
        throw new Error('Customer and license plate are required');
    }

    // Try to find existing vehicle by license_plate and customer_id
    let vehicle = await Vehicle.findOne({
        where: {
            license_plate,
            customer_id
        }
    });

    if (vehicle) {
        // Update vehicle info if found (same customer booking again)
        await vehicle.update({ make, year, model, vin, mileage, note });
        return { vehicle, created: false };
    }

    // Note: We allow same license plate for different customers
    // Use case: Friend/family member booking on behalf of owner,
    //           company employee booking company vehicle, etc.
    // Each customer gets their own vehicle record for the same physical car.

    // Create new vehicle record for this customer
    vehicle = await Vehicle.create({
        customer_id,
        license_plate,
        make,
        year,
        model,
        vin,
        mileage,
        note
    });

    return { vehicle, created: true };
};
