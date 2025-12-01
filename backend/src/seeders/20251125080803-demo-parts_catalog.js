'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('parts_catalog', [
      { id: 1, sku: 'PT001', name: 'Lọc dầu động cơ', unit_price: 120000, unit: 'cái', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 2, sku: 'PT002', name: 'Lọc gió động cơ', unit_price: 180000, unit: 'cái', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 3, sku: 'PT003', name: 'Bugi Iridium', unit_price: 250000, unit: 'cái', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 4, sku: 'PT004', name: 'Dầu động cơ 5W-30', unit_price: 90000, unit: 'lít', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 5, sku: 'PT005', name: 'Dầu hộp số ATF', unit_price: 200000, unit: 'lít', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      { id: 6, sku: 'PT006', name: 'Má phanh trước', unit_price: 600000, unit: 'bộ', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 7, sku: 'PT007', name: 'Má phanh sau', unit_price: 550000, unit: 'bộ', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 8, sku: 'PT008', name: 'Lốp Bridgestone 205/55R16', unit_price: 1600000, unit: 'cái', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 9, sku: 'PT009', name: 'Ắc quy GS 12V', unit_price: 1800000, unit: 'bình', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 10, sku: 'PT010', name: 'Lọc nhiên liệu', unit_price: 300000, unit: 'cái', active: true, created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('parts_catalog', null, {});
  }
};
