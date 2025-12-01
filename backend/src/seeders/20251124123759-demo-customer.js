'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('customers', [
      { id: 1, user_id: 8, name: 'Vu Duy Dung', phone: '0911000001', email: 'dung1@gmail.com', address: 'Hanoi', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 2, user_id: 9, name: 'Vu Duy Nam', phone: '0911000002', email: 'nam1@gmail.com', address: 'HCM', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 3, user_id: 10, name: 'Vu Duy Sy', phone: '0911000003', email: 'sy1@gmail.com', address: 'Da Nang', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      { id: 4, user_id: null, name: 'Customer 4', phone: '0911000004', email: 'c4@mail.com', address: 'Hue', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 5, user_id: null, name: 'Customer 5', phone: '0911000005', email: 'c5@mail.com', address: 'Hanoi', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 6, user_id: null, name: 'Customer 6', phone: '0911000006', email: 'c6@mail.com', address: 'HCM', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 7, user_id: null, name: 'Customer 7', phone: '0911000007', email: 'c7@mail.com', address: 'Hanoi', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 8, user_id: null, name: 'Customer 8', phone: '0911000008', email: 'c8@mail.com', address: 'Quang Ninh', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 9, user_id: null, name: 'Customer 9', phone: '0911000009', email: 'c9@mail.com', address: 'HCM', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 10, user_id: null, name: 'Customer 10', phone: '0911000010', email: 'c10@mail.com', address: 'Hanoi', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
