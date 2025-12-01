'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('services_catalog', [
      { id: 1, code: 'SVC001', name: 'Thay dầu động cơ', price: 300000, duration_minutes: 30, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 2, code: 'SVC002', name: 'Thay dầu hộp số', price: 700000, duration_minutes: 60, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 3, code: 'SVC003', name: 'Vệ sinh buồng đốt', price: 500000, duration_minutes: 45, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 4, code: 'SVC004', name: 'Thay lọc dầu', price: 150000, duration_minutes: 20, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 5, code: 'SVC005', name: 'Thay lọc gió', price: 200000, duration_minutes: 20, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      { id: 6, code: 'SVC006', name: 'Cân bằng lốp', price: 250000, duration_minutes: 30, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 7, code: 'SVC007', name: 'Thay lốp', price: 500000, duration_minutes: 40, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 8, code: 'SVC008', name: 'Vệ sinh kim phun', price: 800000, duration_minutes: 50, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 9, code: 'SVC009', name: 'Thay bugi', price: 350000, duration_minutes: 20, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 10, code: 'SVC010', name: 'Bảo dưỡng tổng quát', price: 1500000, duration_minutes: 120, active: true, description: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('services_catalog', null, {});
  }
};
