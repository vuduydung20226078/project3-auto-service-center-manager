'use strict';
const bcrypt = require("bcryptjs");
const password_fakedata = bcrypt.hashSync("Password123!", 10);

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [

      // Admin
      { id: 1, role_id: 1, username: 'admin', password_hash: password_fakedata, full_name: 'System Admin', phone: '0900000008', email: 'admin@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      // Advisors
      { id: 2, role_id: 2, username: 'advisor1', password_hash: password_fakedata, full_name: 'Advisor One', phone: '0900000009', email: 'advisor1@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 3, role_id: 2, username: 'advisor2', password_hash: password_fakedata, full_name: 'Advisor Two', phone: '0900000010', email: 'advisor2@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      // Technicians
      { id: 4, role_id: 3, username: 'tech1', password_hash: password_fakedata, full_name: 'Tech One', phone: '0900000004', email: 'tech1@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 5, role_id: 3, username: 'tech2', password_hash: password_fakedata, full_name: 'Tech Two', phone: '0900000005', email: 'tech2@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 6, role_id: 3, username: 'tech3', password_hash: password_fakedata, full_name: 'Tech Three', phone: '0900000006', email: 'tech3@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      // Cashiers
      { id: 7, role_id: 4, username: 'cashier1', password_hash: password_fakedata, full_name: 'Cashier One', phone: '0900000007', email: 'cashier1@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      // Customers (linked to real customers)
      { id: 8, role_id: 5, username: 'cus1', password_hash: password_fakedata, full_name: 'Vu Duy Dung', phone: '0900000001', email: 'dung1@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 9, role_id: 5, username: 'cus2', password_hash: password_fakedata, full_name: 'Vu Duy Nam', phone: '0900000002', email: 'nam1@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 10, role_id: 5, username: 'cus3', password_hash: password_fakedata, full_name: 'Vu Duy Sy', phone: '0900000003', email: 'sy1@gmail.com', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
