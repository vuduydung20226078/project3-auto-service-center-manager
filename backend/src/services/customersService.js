const { Customer, Vehicle } = require('../models');

/**
 * Get all customers
 */
exports.getAllCustomers = async () => {
    return await Customer.findAll({
        attributes: ['id', 'name', 'phone', 'email'],
        order: [['name', 'ASC']]
    });
};

/**
 * Get customer by ID
 */
exports.getCustomerById = async (id) => {
    return await Customer.findByPk(id, {
        include: [
            { model: Vehicle, attributes: ['id', 'license_plate', 'make', 'model', 'year'] }
        ]
    });
};

/**
 * Create new customer
 */
exports.createCustomer = async (customerData) => {
    const { name, phone, email, address } = customerData;

    // Validation
    if (!name || !phone) {
        throw new Error('Name and phone are required');
    }

    // Check for duplicate phone
    const existingCustomer = await Customer.findOne({ where: { phone } });
    if (existingCustomer) {
        throw new Error('Customer with this phone number already exists');
    }

    // Check for duplicate email if provided
    if (email) {
        const existingEmail = await Customer.findOne({ where: { email } });
        if (existingEmail) {
            throw new Error('Customer with this email already exists');
        }
    }

    return await Customer.create({
        name,
        phone,
        email,
        address,
        user_id: null // Walk-in customer
    });
};

/**
 * Update customer
 */
exports.updateCustomer = async (id, customerData) => {
    const customer = await Customer.findByPk(id);

    if (!customer) {
        return null;
    }

    const { name, phone, email, address } = customerData;

    // Check for duplicate phone (excluding current customer)
    if (phone && phone !== customer.phone) {
        const existingPhone = await Customer.findOne({ where: { phone } });
        if (existingPhone && existingPhone.id !== id) {
            throw new Error('Customer with this phone number already exists');
        }
    }

    // Check for duplicate email (excluding current customer)
    if (email && email !== customer.email) {
        const existingEmail = await Customer.findOne({ where: { email } });
        if (existingEmail && existingEmail.id !== id) {
            throw new Error('Customer with this email already exists');
        }
    }

    await customer.update({ name, phone, email, address });
    return customer;
};

/**
 * Delete customer
 */
exports.deleteCustomer = async (id) => {
    const customer = await Customer.findByPk(id);

    if (!customer) {
        return null;
    }

    await customer.destroy();
    return customer;
};

/**
 * Find customer by phone
 */
exports.findCustomerByPhone = async (phone) => {
    return await Customer.findOne({ where: { phone } });
};

/**
 * Find customer by email
 */
exports.findCustomerByEmail = async (email) => {
    return await Customer.findOne({ where: { email } });
};

/**
 * Find or create customer (for booking without login)
 * Check by email first, then phone if no email
 */
exports.findOrCreateCustomer = async (customerData) => {
    const { name, phone, email, address } = customerData;

    // Validation - at least name and (email OR phone) required
    if (!name) {
        throw new Error('Name is required');
    }

    if (!email && !phone) {
        throw new Error('Either email or phone is required');
    }

    let customer = null;

    // First, try to find by email (most reliable)
    if (email) {
        customer = await Customer.findOne({ where: { email } });
        if (customer) {
            // Update customer info if found
            await customer.update({ name, phone, address });
            return { customer, created: false };
        }
    }

    // If no email match, try phone
    if (phone) {
        customer = await Customer.findOne({ where: { phone } });
        if (customer) {
            // Update email and other info if found
            await customer.update({ name, email, address });
            return { customer, created: false };
        }
    }

    // If not found, create new
    customer = await Customer.create({
        name,
        phone,
        email,
        address,
        user_id: null
    });

    return { customer, created: true };
};
