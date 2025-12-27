'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Remove last_updated column from stocks table
        await queryInterface.removeColumn('stocks', 'last_updated');
    },

    async down(queryInterface, Sequelize) {
        // Add back last_updated column if rollback
        await queryInterface.addColumn('stocks', 'last_updated', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()')
        });
    }
};
