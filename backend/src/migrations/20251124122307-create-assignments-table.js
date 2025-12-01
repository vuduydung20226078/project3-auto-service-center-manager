'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assignments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      work_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'work_orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      technician_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assigned_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      status: { type: Sequelize.ENUM('ASSIGNED', 'ACCEPTED', 'REJECTED', 'DONE'), defaultValue: 'ASSIGNED' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
    await queryInterface.addIndex('assignments', ['work_order_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('assignments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assignments_status";');
  }
};
