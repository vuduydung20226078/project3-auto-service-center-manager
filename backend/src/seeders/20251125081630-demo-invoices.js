'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('invoices', [
      { id: 1, work_order_id: 1, invoice_no: 'INV001', amount_due: 240000, status: 'UNPAID', created_at: '2024-02-01 11:00:00' },
      { id: 2, work_order_id: 2, invoice_no: 'INV002', amount_due: 300000, status: 'UNPAID', created_at: '2024-02-02 12:00:00' },
      { id: 3, work_order_id: 3, invoice_no: 'INV003', amount_due: 750000, status: 'UNPAID', created_at: '2024-02-03 12:40:00' },
      { id: 4, work_order_id: 4, invoice_no: 'INV004', amount_due: 200000, status: 'UNPAID', created_at: '2024-02-04 15:00:00' },
      { id: 5, work_order_id: 5, invoice_no: 'INV005', amount_due: 1600000, status: 'UNPAID', created_at: '2024-02-05 16:00:00' },

      { id: 6, work_order_id: 6, invoice_no: 'INV006', amount_due: 250000, status: 'UNPAID', created_at: '2024-02-06 10:00:00' },
      { id: 7, work_order_id: 7, invoice_no: 'INV007', amount_due: 1800000, status: 'UNPAID', created_at: '2024-02-07 16:00:00' },
      { id: 8, work_order_id: 8, invoice_no: 'INV008', amount_due: 300000, status: 'UNPAID', created_at: '2024-02-08 17:00:00' },
      { id: 9, work_order_id: 9, invoice_no: 'INV009', amount_due: 180000, status: 'UNPAID', created_at: '2024-02-09 09:00:00' },
      { id: 10, work_order_id: 10, invoice_no: 'INV010', amount_due: 400000, status: 'UNPAID', created_at: '2024-02-10 18:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('invoices', null, {});
  }
};
