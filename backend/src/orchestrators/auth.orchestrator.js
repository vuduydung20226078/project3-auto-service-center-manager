const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { usersRepo, customersRepo } = require('../repositories');

async function registerUserAndCustomer({ username, email, password }) {
    const t = await sequelize.transaction();
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        // Check if customer already exists with this email
        const existingCustomer = await customersRepo.findByEmail(email);

        if (existingCustomer) {
            // If customer exists but already linked to a user account, cannot register
            if (existingCustomer.user_id) {
                throw new Error('Email already registered with an account');
            }

            // Customer exists but not linked to any user (walk-in customer)
            // Create user and link to existing customer
            const user = await usersRepo.create({
                username,
                email,
                password_hash: passwordHash,
                role_id: 5
            }, t);

            // Update existing customer with user_id
            const customer = await customersRepo.update(existingCustomer.id, {
                user_id: user.id,
                name: username // Update name with username
            }, t);

            await t.commit();
            return { user, customer };
        }

        // No existing customer, create both user and customer
        const user = await usersRepo.create({
            username,
            email,
            password_hash: passwordHash,
            role_id: 5
        }, t);

        // Create corresponding customer record linked to user
        const customer = await customersRepo.create({
            user_id: user.id,
            name: username,
            email
        }, t);

        await t.commit();
        // return both created entities (user may not have Role included here)
        return { user, customer };
    } catch (err) {
        await t.rollback();
        throw err;
    }
}

module.exports = {
    registerUserAndCustomer
};
