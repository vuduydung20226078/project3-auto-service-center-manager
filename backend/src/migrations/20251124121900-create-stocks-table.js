'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stocks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      part_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'parts_catalog', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      qty: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      location: { type: Sequelize.STRING(100) },
      last_updated: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('stocks', ['part_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stocks');
  }
};
