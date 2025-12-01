'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('stocks', [
      { id: 1, part_id: 1, qty: 50, location: 'Kệ A1', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 2, part_id: 2, qty: 40, location: 'Kệ A2', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 3, part_id: 3, qty: 80, location: 'Kệ A3', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 4, part_id: 4, qty: 120, location: 'Kệ B1', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 5, part_id: 5, qty: 60, location: 'Kệ B2', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      { id: 6, part_id: 6, qty: 25, location: 'Kệ C1', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 7, part_id: 7, qty: 30, location: 'Kệ C2', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 8, part_id: 8, qty: 10, location: 'Kệ D1', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 9, part_id: 9, qty: 8, location: 'Kệ D2', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 10, part_id: 10, qty: 35, location: 'Kệ E1', last_updated: '2024-01-01 10:00:00', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stocks', null, {});
  }
};
