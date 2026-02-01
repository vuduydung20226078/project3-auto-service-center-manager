'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add provider field
    await queryInterface.addColumn('payments', 'provider', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: 'CASH',
      comment: 'Payment provider: VNPAY, MOMO, CARD, CASH, BANK_TRANSFER',
      after: 'invoice_id'
    });

    // Add status field
    await queryInterface.addColumn('payments', 'status', {
      type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'PENDING',
      comment: 'Payment status',
      after: 'provider'
    });

    // Add transaction_ref field
    await queryInterface.addColumn('payments', 'transaction_ref', {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Transaction reference from payment provider',
      after: 'status'
    });

    // Add raw_response field
    await queryInterface.addColumn('payments', 'raw_response', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Full response from payment provider',
      after: 'transaction_ref'
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('payments', ['transaction_ref'], {
      name: 'idx_payments_transaction_ref'
    });

    await queryInterface.addIndex('payments', ['status'], {
      name: 'idx_payments_status'
    });

    await queryInterface.addIndex('payments', ['provider'], {
      name: 'idx_payments_provider'
    });

    // Update existing records to have SUCCESS status
    await queryInterface.sequelize.query(`
      UPDATE payments 
      SET status = 'SUCCESS', provider = COALESCE(method, 'CASH')
      WHERE status IS NULL OR status = 'PENDING'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('payments', 'idx_payments_transaction_ref');
    await queryInterface.removeIndex('payments', 'idx_payments_status');
    await queryInterface.removeIndex('payments', 'idx_payments_provider');

    // Remove columns
    await queryInterface.removeColumn('payments', 'raw_response');
    await queryInterface.removeColumn('payments', 'transaction_ref');
    await queryInterface.removeColumn('payments', 'status');
    await queryInterface.removeColumn('payments', 'provider');

    // Drop enum type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
  }
};
