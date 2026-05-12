/**
 * Customers Repository
 * Isolates Sequelize queries from service layer
 */
const { Customer, User } = require('../models');

class CustomersRepository {
    /**
     * Create a new customer
     */
    async create(data, transaction = null) {
        // Validate unique phone if provided
        if (data.phone) {
            const existingByPhone = await this.findByPhone(data.phone);
            if (existingByPhone) {
                throw new Error(`Customer with phone ${data.phone} already exists`);
            }
        }

        // Validate unique email if provided
        if (data.email) {
            const existingByEmail = await this.findByEmail(data.email);
            if (existingByEmail) {
                throw new Error(`Customer with email ${data.email} already exists`);
            }
        }

        return await Customer.create(data, { transaction });
    }

    /**
     * Find customer by ID
     */
    async findById(id) {
        return await Customer.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'role_id']
                }
            ]
        });
    }

    /**
     * Find customer by user_id
     */
    async findByUserId(userId) {
        return await Customer.findOne({
            where: { user_id: userId }
        });
    }

    /**
     * Find customer by phone
     */
    async findByPhone(phone) {
        if (!phone) return null;
        return await Customer.findOne({
            where: { phone }
        });
    }

    /**
     * Find customer by email
     */
    async findByEmail(email) {
        if (!email) return null;
        return await Customer.findOne({
            where: { email }
        });
    }

    /**
     * Find all customers
     */
    async findAll() {
        return await Customer.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'role_id']
                }
            ],
            order: [['name', 'ASC']]
        });
    }

    /**
     * Update customer
     */
    async update(id, data, transaction = null) {
        const customer = await Customer.findByPk(id);
        if (!customer) return null;

        // Validate unique phone if being updated
        if (data.phone && data.phone !== customer.phone) {
            const existingByPhone = await this.findByPhone(data.phone);
            if (existingByPhone && existingByPhone.id !== id) {
                throw new Error(`Customer with phone ${data.phone} already exists`);
            }
        }

        // Validate unique email if being updated
        if (data.email && data.email !== customer.email) {
            const existingByEmail = await this.findByEmail(data.email);
            if (existingByEmail && existingByEmail.id !== id) {
                throw new Error(`Customer with email ${data.email} already exists`);
            }
        }

        await customer.update(data, { transaction });
        return customer;
    }

    /**
     * Delete customer
     */
    async delete(id, transaction = null) {
        const customer = await Customer.findByPk(id);
        if (!customer) return null;

        await customer.destroy({ transaction });
        return customer;
    }

    /**
     * Find or create customer
     */
    async findOrCreate(customerData, transaction = null) {
        // Try to find by phone first (most common identifier)
        if (customerData.phone) {
            let customer = await this.findByPhone(customerData.phone);
            if (customer) {
                return { customer, created: false };
            }
        }

        // If email provided, check if customer exists with same email
        if (customerData.email) {
            let customer = await this.findByEmail(customerData.email);
            if (customer) {
                return { customer, created: false };
            }
        }

        // Create new customer
        const customer = await this.create(customerData, transaction);
        return { customer, created: true };
    }
}

module.exports = new CustomersRepository();
