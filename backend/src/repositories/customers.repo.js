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
        return await Customer.findOne({
            where: { phone }
        });
    }

    /**
     * Find customer by email
     */
    async findByEmail(email) {
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
        let customer = await this.findByPhone(customerData.phone);

        if (customer) {
            return { customer, created: false };
        }

        // If email provided, check if customer exists with same email
        if (customerData.email) {
            customer = await this.findByEmail(customerData.email);
            if (customer) {
                return { customer, created: false };
            }
        }

        // Create new customer
        customer = await this.create(customerData, transaction);
        return { customer, created: true };
    }
}

module.exports = new CustomersRepository();
