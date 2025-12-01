'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('work_order_items', [
      { id: 1, work_order_id: 1, item_type: 'SERVICE', item_id: 1, description: 'Thay dầu động cơ', quantity: 1, unit_price: 120000, line_total: 120000 },
      { id: 2, work_order_id: 1, item_type: 'PART', item_id: 1, description: 'Lọc dầu', quantity: 1, unit_price: 120000, line_total: 120000 },

      { id: 3, work_order_id: 2, item_type: 'SERVICE', item_id: 2, description: 'Bảo dưỡng định kỳ', quantity: 1, unit_price: 300000, line_total: 300000 },

      { id: 4, work_order_id: 3, item_type: 'SERVICE', item_id: 3, description: 'Thay má phanh', quantity: 1, unit_price: 150000, line_total: 150000 },
      { id: 5, work_order_id: 3, item_type: 'PART', item_id: 6, description: 'Má phanh trước', quantity: 1, unit_price: 600000, line_total: 600000 },

      { id: 6, work_order_id: 4, item_type: 'SERVICE', item_id: 4, description: 'Kiểm tra động cơ', quantity: 1, unit_price: 200000, line_total: 200000 },

      { id: 7, work_order_id: 5, item_type: 'PART', item_id: 8, description: 'Lốp Bridgestone', quantity: 1, unit_price: 1600000, line_total: 1600000 },

      { id: 8, work_order_id: 6, item_type: 'SERVICE', item_id: 5, description: 'Vệ sinh kim phun', quantity: 1, unit_price: 250000, line_total: 250000 },

      { id: 9, work_order_id: 7, item_type: 'PART', item_id: 9, description: 'Ắc quy GS', quantity: 1, unit_price: 1800000, line_total: 1800000 },

      { id: 10, work_order_id: 8, item_type: 'SERVICE', item_id: 6, description: 'Kiểm tra tổng quát', quantity: 1, unit_price: 300000, line_total: 300000 }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('work_order_items', null, {});
  }
};
