'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('work_orders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      booking_id: {
        type: Sequelize.INTEGER,
        references: { model: 'bookings', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      advisor_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        references: { model: 'vehicles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: { type: Sequelize.ENUM('OPEN', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CLOSED'), defaultValue: 'OPEN' },
      total_amount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('work_orders', ['status']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('work_orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_work_orders_status";');
  }
};
