'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('bookings', 'work_order_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'work_orders',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('bookings', 'work_order_id');
    }
};
