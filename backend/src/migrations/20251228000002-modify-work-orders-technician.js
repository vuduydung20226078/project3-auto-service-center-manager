'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Xóa cột advisor_id
        await queryInterface.removeColumn('work_orders', 'advisor_id');

        // Thêm cột technician_id
        await queryInterface.addColumn('work_orders', 'technician_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'technicians',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        await queryInterface.addIndex('work_orders', ['technician_id'], {
            name: 'work_orders_technician_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        // Xóa cột technician_id và index
        await queryInterface.removeIndex('work_orders', 'work_orders_technician_id_idx');
        await queryInterface.removeColumn('work_orders', 'technician_id');

        // Thêm lại cột advisor_id
        await queryInterface.addColumn('work_orders', 'advisor_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    }
};
