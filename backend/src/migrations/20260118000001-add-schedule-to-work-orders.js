'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('work_orders', 'start_time', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Scheduled start time for the work order'
        });

        await queryInterface.addColumn('work_orders', 'end_time', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Scheduled end time (estimated)'
        });

        await queryInterface.addColumn('work_orders', 'estimated_duration', {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Estimated duration in minutes'
        });

        // Add index for performance on availability queries
        await queryInterface.addIndex('work_orders', ['technician_id', 'start_time', 'end_time'], {
            name: 'idx_work_orders_schedule'
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeIndex('work_orders', 'idx_work_orders_schedule');
        await queryInterface.removeColumn('work_orders', 'estimated_duration');
        await queryInterface.removeColumn('work_orders', 'end_time');
        await queryInterface.removeColumn('work_orders', 'start_time');
    }
};
