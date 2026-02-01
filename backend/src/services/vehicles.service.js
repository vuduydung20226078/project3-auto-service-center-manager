/**
 * Vehicles Service
 * Business logic for vehicle operations
 */
const vehiclesRepo = require('../repositories/vehicles.repo');
const customersRepo = require('../repositories/customers.repo');

class VehiclesService {
    /**
     * Create a new vehicle with validation
     */
    async createVehicle({ customer_id, license_plate, make, model, year, vin, mileage, note }) {
        // Validate required fields
        if (!customer_id) {
            throw new Error('Customer ID is required');
        }

        if (!license_plate || license_plate.trim() === '') {
            throw new Error('License plate is required');
        }

        // Normalize license plate (uppercase, trim)
        const normalizedPlate = license_plate.trim().toUpperCase();

        // Verify customer exists
        const customer = await customersRepo.findById(customer_id);
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Check for duplicate license plate
        const existingVehicle = await vehiclesRepo.findByLicensePlate(normalizedPlate);
        if (existingVehicle) {
            throw new Error('Vehicle with this license plate already exists');
        }

        // Validate year if provided
        if (year) {
            const currentYear = new Date().getFullYear();
            if (year < 1900 || year > currentYear + 1) {
                throw new Error(`Year must be between 1900 and ${currentYear + 1}`);
            }
        }

        // Validate mileage if provided
        if (mileage && mileage < 0) {
            throw new Error('Mileage cannot be negative');
        }

        // Create vehicle
        const vehicleData = {
            customer_id,
            license_plate: normalizedPlate,
            make: make?.trim() || null,
            model: model?.trim() || null,
            year: year || null,
            vin: vin?.trim() || null,
            mileage: mileage || null,
            note: note?.trim() || null
        };

        const vehicle = await vehiclesRepo.create(vehicleData);
        return vehicle;
    }

    /**
     * Update vehicle with validation
     */
    async updateVehicle(vehicleId, customerId, updateData) {
        const vehicle = await vehiclesRepo.findById(vehicleId);

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        // Verify ownership for customers
        if (customerId && vehicle.customer_id !== customerId) {
            throw new Error('You can only update your own vehicles');
        }

        // Validate license plate if being updated
        if (updateData.license_plate) {
            const normalizedPlate = updateData.license_plate.trim().toUpperCase();

            if (normalizedPlate !== vehicle.license_plate) {
                const existingVehicle = await vehiclesRepo.findByLicensePlate(normalizedPlate);
                if (existingVehicle && existingVehicle.id !== vehicleId) {
                    throw new Error('Vehicle with this license plate already exists');
                }
            }

            updateData.license_plate = normalizedPlate;
        }

        // Validate year if provided
        if (updateData.year) {
            const currentYear = new Date().getFullYear();
            if (updateData.year < 1900 || updateData.year > currentYear + 1) {
                throw new Error(`Year must be between 1900 and ${currentYear + 1}`);
            }
        }

        // Validate mileage if provided
        if (updateData.mileage !== undefined && updateData.mileage < 0) {
            throw new Error('Mileage cannot be negative');
        }

        const updatedVehicle = await vehiclesRepo.update(vehicleId, updateData);
        return updatedVehicle;
    }

    /**
     * Get vehicle by ID with ownership check
     */
    async getVehicleById(vehicleId, customerId) {
        const vehicle = await vehiclesRepo.findById(vehicleId);

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        // Verify ownership for customers
        if (customerId && vehicle.customer_id !== customerId) {
            throw new Error('You can only access your own vehicles');
        }

        return vehicle;
    }

    /**
     * Delete vehicle with ownership check
     */
    async deleteVehicle(vehicleId, customerId) {
        const vehicle = await vehiclesRepo.findById(vehicleId);

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        // Verify ownership for customers
        if (customerId && vehicle.customer_id !== customerId) {
            throw new Error('You can only delete your own vehicles');
        }

        await vehiclesRepo.delete(vehicleId);
        return { message: 'Vehicle deleted successfully' };
    }

    /**
     * Get service history for a vehicle
     */
    async getVehicleServiceHistory(vehicleId, customerId) {
        const vehicle = await vehiclesRepo.findById(vehicleId);

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        // Verify ownership for customers
        if (customerId && vehicle.customer_id !== customerId) {
            throw new Error('You can only access your own vehicles');
        }

        const serviceHistory = await vehiclesRepo.getServiceHistory(vehicleId);
        return serviceHistory;
    }
}

module.exports = new VehiclesService();
