'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'status', {
            type: Sequelize.ENUM('active', 'disabled'),
            defaultValue: 'active',
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'status');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_status";');
    }
};
