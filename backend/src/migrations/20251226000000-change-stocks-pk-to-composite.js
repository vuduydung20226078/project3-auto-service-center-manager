'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Xóa primary key constraint cũ (id)
        await queryInterface.removeConstraint('stocks', 'stocks_pkey');

        // 2. Xóa cột id
        await queryInterface.removeColumn('stocks', 'id');

        // 3. Thêm unique constraint cho (part_id, location) làm composite primary key
        await queryInterface.addConstraint('stocks', {
            fields: ['part_id', 'location'],
            type: 'primary key',
            name: 'stocks_pkey'
        });

        // 4. Đảm bảo location không null
        await queryInterface.changeColumn('stocks', 'location', {
            type: Sequelize.STRING(100),
            allowNull: false,
            defaultValue: 'Default'
        });
    },

    async down(queryInterface, Sequelize) {
        // Rollback: khôi phục lại id column và PK
        await queryInterface.removeConstraint('stocks', 'stocks_pkey');

        await queryInterface.addColumn('stocks', 'id', {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        });

        await queryInterface.changeColumn('stocks', 'location', {
            type: Sequelize.STRING(100),
            allowNull: true
        });
    }
};
