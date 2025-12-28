'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Thêm cột description vào work_order_items nếu chưa có
        const tableDescription = await queryInterface.describeTable('work_order_items');

        if (!tableDescription.description) {
            await queryInterface.addColumn('work_order_items', 'description', {
                type: Sequelize.TEXT,
                allowNull: true
            });
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('work_order_items', 'description');
    }
};
