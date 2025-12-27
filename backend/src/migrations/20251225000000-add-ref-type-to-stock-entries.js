'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Xóa cột ref cũ
        await queryInterface.removeColumn('stock_entries', 'ref');

        // Thêm cột ref_type với ENUM
        await queryInterface.addColumn('stock_entries', 'ref_type', {
            type: Sequelize.ENUM('RET', 'ADJ', 'PO', 'WO', 'INV', 'DAMAGED', 'LOST', 'MANUAL'),
            allowNull: false,
            defaultValue: 'MANUAL',
            comment: 'RET=Return, ADJ=Adjustment, PO=Purchase Order, WO=Work Order, INV=Invoice, DAMAGED=Damaged, LOST=Lost, MANUAL=Manual'
        });

        // Thêm index để query nhanh theo ref_type
        await queryInterface.addIndex('stock_entries', ['ref_type'], {
            name: 'idx_stock_entries_ref_type'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('stock_entries', 'idx_stock_entries_ref_type');
        await queryInterface.removeColumn('stock_entries', 'ref_type');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_stock_entries_ref_type";');

        // Khôi phục cột ref
        await queryInterface.addColumn('stock_entries', 'ref', {
            type: Sequelize.STRING(200),
            allowNull: true
        });
    }
};
