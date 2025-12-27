'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('stocks', [
      { part_id: 1, qty: 50, location: 'Kệ A1', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 2, qty: 40, location: 'Kệ A2', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 3, qty: 80, location: 'Kệ A3', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 4, qty: 120, location: 'Kệ B1', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 5, qty: 60, location: 'Kệ B2', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      { part_id: 6, qty: 25, location: 'Kệ C1', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 7, qty: 30, location: 'Kệ C2', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 8, qty: 10, location: 'Kệ D1', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 9, qty: 8, location: 'Kệ D2', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { part_id: 10, qty: 35, location: 'Kệ E1', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stocks', null, {});
  }
};
