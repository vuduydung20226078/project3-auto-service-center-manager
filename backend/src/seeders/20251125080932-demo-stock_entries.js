'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('stock_entries', [
      { id: 1, part_id: 1, qty: 50, type: 'IN', ref: 'NHAP_KHO_001', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 2, part_id: 2, qty: 40, type: 'IN', ref: 'NHAP_KHO_002', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 3, part_id: 3, qty: 80, type: 'IN', ref: 'NHAP_KHO_003', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 4, part_id: 4, qty: 120, type: 'IN', ref: 'NHAP_KHO_004', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 5, part_id: 5, qty: 60, type: 'IN', ref: 'NHAP_KHO_005', created_by: 1, created_at: '2024-01-01 10:00:00' },

      { id: 6, part_id: 6, qty: 25, type: 'IN', ref: 'NHAP_KHO_006', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 7, part_id: 7, qty: 30, type: 'IN', ref: 'NHAP_KHO_007', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 8, part_id: 8, qty: 10, type: 'IN', ref: 'NHAP_KHO_008', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 9, part_id: 9, qty: 8, type: 'IN', ref: 'NHAP_KHO_009', created_by: 1, created_at: '2024-01-01 10:00:00' },
      { id: 10, part_id: 10, qty: 35, type: 'IN', ref: 'NHAP_KHO_010', created_by: 1, created_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stock_entries', null, {});
  }
};
