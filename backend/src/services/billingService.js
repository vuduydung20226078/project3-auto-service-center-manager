const { invoices, payments, work_orders, sequelize } = require('../models');

// Tạo hóa đơn từ work order
exports.createInvoice = async ({ work_order_id, invoice_no }) => {
    const wo = await work_orders.findByPk(work_order_id);
    if (!wo) throw new Error('Work Order not found');
    return await invoices.create({
        work_order_id,
        invoice_no,
        amount_due: wo.total_amount,
        status: 'UNPAID'
    });
};

// Lấy hóa đơn theo ID
exports.getInvoice = async (id) => {
    return await invoices.findByPk(id);
};

// Thêm thanh toán vào hóa đơn
exports.addPayment = async (id, { amount, method, user_id }) => {
    await sequelize.transaction(async (t) => {
        await payments.create({ invoice_id: id, amount, method, received_by: user_id }, { transaction: t });

        // Tính tổng số tiền đã thanh toán
        const [sum] = await sequelize.query(
            `SELECT COALESCE(SUM(amount), 0) AS paid FROM payments WHERE invoice_id = :id`,
            { replacements: { id }, transaction: t, type: sequelize.QueryTypes.SELECT }
        );

        // Cập nhật trạng thái hóa đơn
        const inv = await invoices.findByPk(id, { transaction: t });
        const status = Number(sum.paid) >= Number(inv.amount_due) ? 'PAID' :
            (Number(sum.paid) > 0 ? 'PARTIALLY_PAID' : 'UNPAID');
        await inv.update({ status }, { transaction: t });
    });
};
