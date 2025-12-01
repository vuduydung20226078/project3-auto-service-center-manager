'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      work_order_id: {
        type: Sequelize.INTEGER,
        references: { model: 'work_orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      invoice_no: { type: Sequelize.STRING(100), unique: true },
      amount_due: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      status: { type: Sequelize.ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID'), defaultValue: 'UNPAID' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('invoices', ['invoice_no']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('invoices');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_invoices_status";');
  }
};
