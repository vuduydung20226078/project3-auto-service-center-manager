'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('vehicles', 'make', {
            type: Sequelize.STRING(100),
            allowNull: true,
            after: 'license_plate'
        });

        await queryInterface.addColumn('vehicles', 'year', {
            type: Sequelize.INTEGER,
            allowNull: true,
            after: 'make'
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('vehicles', 'make');
        await queryInterface.removeColumn('vehicles', 'year');
    }
};
