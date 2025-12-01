'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'customers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      license_plate: { type: Sequelize.STRING(30), allowNull: false },
      model: { type: Sequelize.STRING(100) },
      vin: { type: Sequelize.STRING(100) },
      mileage: { type: Sequelize.INTEGER },
      note: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('vehicles', ['license_plate']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vehicles');
  }
};
