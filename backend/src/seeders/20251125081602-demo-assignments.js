'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('assignments', [
      { id: 1, work_order_id: 1, technician_id: 4, assigned_at: '2024-02-01 09:15:00', status: 'ASSIGNED' },
      { id: 2, work_order_id: 2, technician_id: 4, assigned_at: '2024-02-02 10:25:00', status: 'ACCEPTED' },
      { id: 3, work_order_id: 3, technician_id: 5, assigned_at: '2024-02-03 11:20:00', status: 'ASSIGNED' },
      { id: 4, work_order_id: 4, technician_id: 6, assigned_at: '2024-02-04 14:10:00', status: 'DONE' },
      { id: 5, work_order_id: 5, technician_id: 7, assigned_at: '2024-02-05 14:45:00', status: 'ASSIGNED' },

      { id: 6, work_order_id: 6, technician_id: 7, assigned_at: '2024-02-06 09:10:00', status: 'ASSIGNED' },
      { id: 7, work_order_id: 7, technician_id: 8, assigned_at: '2024-02-07 15:20:00', status: 'ACCEPTED' },
      { id: 8, work_order_id: 8, technician_id: 8, assigned_at: '2024-02-08 16:30:00', status: 'ASSIGNED' },
      { id: 9, work_order_id: 9, technician_id: 9, assigned_at: '2024-02-09 08:25:00', status: 'DONE' },
      { id: 10, work_order_id: 10, technician_id: 9, assigned_at: '2024-02-10 17:35:00', status: 'ASSIGNED' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('assignments', null, {});
  }
};
