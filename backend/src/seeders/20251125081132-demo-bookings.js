'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('bookings', [
      { id: 1, customer_id: 1, vehicle_id: 1, scheduled_at: '2024-02-01 09:00:00', status: 'CONFIRMED', notes: 'Thay dầu máy', created_at: '2024-01-01 10:00:00' },
      { id: 2, customer_id: 2, vehicle_id: 2, scheduled_at: '2024-02-02 10:00:00', status: 'CONFIRMED', notes: 'Bảo dưỡng định kỳ', created_at: '2024-01-01 10:00:00' },
      { id: 3, customer_id: 3, vehicle_id: 3, scheduled_at: '2024-02-03 11:00:00', status: 'CONFIRMED', notes: 'Thay má phanh', created_at: '2024-01-01 10:00:00' },
      { id: 4, customer_id: 4, vehicle_id: 4, scheduled_at: '2024-02-04 13:00:00', status: 'PENDING', notes: 'Rung động cơ', created_at: '2024-01-01 10:00:00' },
      { id: 5, customer_id: 5, vehicle_id: 5, scheduled_at: '2024-02-05 14:00:00', status: 'CONFIRMED', notes: 'Vệ sinh kim phun', created_at: '2024-01-01 10:00:00' },

      { id: 6, customer_id: 6, vehicle_id: 6, scheduled_at: '2024-02-06 09:00:00', status: 'CANCELLED', notes: 'Đổi lịch', created_at: '2024-01-01 10:00:00' },
      { id: 7, customer_id: 7, vehicle_id: 7, scheduled_at: '2024-02-07 15:00:00', status: 'CONFIRMED', notes: 'Căn chỉnh thước lái', created_at: '2024-01-01 10:00:00' },
      { id: 8, customer_id: 8, vehicle_id: 8, scheduled_at: '2024-02-08 16:00:00', status: 'CONFIRMED', notes: 'Thay ắc quy', created_at: '2024-01-01 10:00:00' },
      { id: 9, customer_id: 9, vehicle_id: 9, scheduled_at: '2024-02-09 08:00:00', status: 'PENDING', notes: 'Kiểm tra hệ thống gầm', created_at: '2024-01-01 10:00:00' },
      { id: 10, customer_id: 10, vehicle_id: 10, scheduled_at: '2024-02-10 17:00:00', status: 'CONFIRMED', notes: 'Kiểm tra tổng quát', created_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('bookings', null, {});
  }
};
