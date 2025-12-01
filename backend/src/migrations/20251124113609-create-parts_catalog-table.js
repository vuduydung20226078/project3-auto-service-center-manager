'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('parts_catalog', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      sku: { type: Sequelize.STRING(100), unique: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      unit: { type: Sequelize.STRING(20) },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('parts_catalog');
  }
};
