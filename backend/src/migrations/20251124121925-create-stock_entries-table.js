'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stock_entries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      part_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'parts_catalog', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      qty: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.ENUM('IN', 'OUT'), allowNull: false },
      ref: { type: Sequelize.STRING(200) },
      created_by: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('stock_entries', ['part_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stock_entries');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_stock_entries_type";');
  }
};
