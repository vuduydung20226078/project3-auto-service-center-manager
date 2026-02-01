const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { usersRepo, customersRepo } = require('../repositories');

async function registerUserAndCustomer({ username, email, password }) {
    const t = await sequelize.transaction();
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user (default role 5 = Customer)
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
