'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('audit_logs', [
      { id: 1, user_id: 1, action: 'LOGIN', meta: JSON.stringify({ ip: '127.0.0.1' }), created_at: '2024-01-01 10:00:00' },
      { id: 2, user_id: 2, action: 'CREATE_BOOKING', meta: JSON.stringify({ booking_id: 1 }), created_at: '2024-02-01 09:05:00' },
      { id: 3, user_id: 3, action: 'UPDATE_STOCK', meta: JSON.stringify({ part_id: 3 }), created_at: '2024-02-02 08:00:00' },
      { id: 4, user_id: 4, action: 'START_WORK', meta: JSON.stringify({ work_order_id: 1 }), created_at: '2024-02-01 09:12:00' },
      { id: 5, user_id: 5, action: 'COMPLETE_WORK', meta: JSON.stringify({ work_order_id: 3 }), created_at: '2024-02-03 12:40:00' },

      { id: 6, user_id: 1, action: 'ISSUE_INVOICE', meta: JSON.stringify({ invoice_id: 4 }), created_at: '2024-02-04 15:10:00' },
      { id: 7, user_id: 2, action: 'PAYMENT_RECEIVED', meta: JSON.stringify({ invoice_id: 6 }), created_at: '2024-02-06 10:25:00' },
      { id: 8, user_id: 3, action: 'UPDATE_BOOKING', meta: JSON.stringify({ booking_id: 8 }), created_at: '2024-02-08 15:00:00' },
      { id: 9, user_id: 4, action: 'LOGOUT', meta: JSON.stringify({}), created_at: '2024-02-08 17:35:00' },
      { id: 10, user_id: 5, action: 'DELETE_BOOKING', meta: JSON.stringify({ booking_id: 9 }), created_at: '2024-02-09 09:40:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('audit_logs', null, {});
  }
};
