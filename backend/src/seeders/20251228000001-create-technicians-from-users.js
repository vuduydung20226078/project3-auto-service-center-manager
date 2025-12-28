'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Tạo technicians từ users với role Technician
        await queryInterface.sequelize.query(`
      INSERT INTO technicians (user_id, status, created_at, updated_at)
      SELECT u.id, 'AVAILABLE', NOW(), NOW()
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'Technician'
      ON CONFLICT (user_id) DO NOTHING;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('technicians', null, {});
    }
};
