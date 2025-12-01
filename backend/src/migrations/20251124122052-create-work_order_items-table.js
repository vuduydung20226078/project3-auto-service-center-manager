'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('work_order_items', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      work_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'work_orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_type: { type: Sequelize.ENUM('SERVICE', 'PART'), allowNull: false },
      item_id: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.TEXT },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      unit_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      line_total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('work_order_items', ['work_order_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('work_order_items');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_work_order_items_item_type";');
  }
};
