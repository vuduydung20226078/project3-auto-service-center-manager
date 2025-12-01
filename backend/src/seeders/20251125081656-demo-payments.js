'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('payments', [
      { id: 1, invoice_id: 1, amount: 240000, method: 'CASH', paid_at: '2024-02-01 11:30:00', received_by: 6 },
      { id: 2, invoice_id: 2, amount: 300000, method: 'BANK_TRANSFER', paid_at: '2024-02-02 12:20:00', received_by: 6 },
      { id: 3, invoice_id: 3, amount: 750000, method: 'CARD', paid_at: '2024-02-03 12:45:00', received_by: 7 },
      { id: 4, invoice_id: 4, amount: 200000, method: 'CASH', paid_at: '2024-02-04 15:30:00', received_by: 7 },
      { id: 5, invoice_id: 5, amount: 1600000, method: 'BANK_TRANSFER', paid_at: '2024-02-05 16:10:00', received_by: 6 },

      { id: 6, invoice_id: 6, amount: 250000, method: 'CASH', paid_at: '2024-02-06 10:20:00', received_by: 6 },
      { id: 7, invoice_id: 7, amount: 1800000, method: 'CARD', paid_at: '2024-02-07 16:20:00', received_by: 7 },
      { id: 8, invoice_id: 8, amount: 300000, method: 'CASH', paid_at: '2024-02-08 17:15:00', received_by: 6 },
      { id: 9, invoice_id: 9, amount: 180000, method: 'CASH', paid_at: '2024-02-09 09:30:00', received_by: 7 },
      { id: 10, invoice_id: 10, amount: 400000, method: 'BANK_TRANSFER', paid_at: '2024-02-10 18:30:00', received_by: 6 }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
