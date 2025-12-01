'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('work_orders', [
      { id: 1, booking_id: 1, advisor_id: 2, vehicle_id: 1, status: 'IN_PROGRESS', total_amount: 0, created_at: '2024-02-01 09:10:00', updated_at: '2024-02-01 09:10:00' },
      { id: 2, booking_id: 2, advisor_id: 2, vehicle_id: 2, status: 'OPEN', total_amount: 0, created_at: '2024-02-02 10:20:00', updated_at: '2024-02-02 10:20:00' },
      { id: 3, booking_id: 3, advisor_id: 3, vehicle_id: 3, status: 'IN_PROGRESS', total_amount: 0, created_at: '2024-02-03 11:15:00', updated_at: '2024-02-03 11:15:00' },
      { id: 4, booking_id: 4, advisor_id: 3, vehicle_id: 4, status: 'WAITING_PARTS', total_amount: 0, created_at: '2024-02-04 14:05:00', updated_at: '2024-02-04 14:05:00' },
      { id: 5, booking_id: 5, advisor_id: 4, vehicle_id: 5, status: 'IN_PROGRESS', total_amount: 0, created_at: '2024-02-05 14:40:00', updated_at: '2024-02-05 14:40:00' },

      { id: 6, booking_id: 6, advisor_id: 4, vehicle_id: 6, status: 'OPEN', total_amount: 0, created_at: '2024-02-06 09:05:00', updated_at: '2024-02-06 09:05:00' },
      { id: 7, booking_id: 7, advisor_id: 5, vehicle_id: 7, status: 'IN_PROGRESS', total_amount: 0, created_at: '2024-02-07 15:15:00', updated_at: '2024-02-07 15:15:00' },
      { id: 8, booking_id: 8, advisor_id: 5, vehicle_id: 8, status: 'OPEN', total_amount: 0, created_at: '2024-02-08 16:25:00', updated_at: '2024-02-08 16:25:00' },
      { id: 9, booking_id: 9, advisor_id: 6, vehicle_id: 9, status: 'IN_PROGRESS', total_amount: 0, created_at: '2024-02-09 08:20:00', updated_at: '2024-02-09 08:20:00' },
      { id: 10, booking_id: 10, advisor_id: 6, vehicle_id: 10, status: 'OPEN', total_amount: 0, created_at: '2024-02-10 17:30:00', updated_at: '2024-02-10 17:30:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('work_orders', null, {});
  }
};
