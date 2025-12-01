const { sequelize } = require('../models');

// Lấy tổng quan dashboard
exports.getDashboardSummary = async () => {
    const [rows] = await sequelize.query(`
        WITH today_rev AS (
          SELECT COALESCE(SUM(p.amount), 0) AS revenue
          FROM payments p
          WHERE DATE(p.paid_at) = CURRENT_DATE
        ),
        month_rev AS (
          SELECT COALESCE(SUM(p.amount), 0) AS revenue
          FROM payments p
          WHERE DATE_TRUNC('month', p.paid_at) = DATE_TRUNC('month', CURRENT_DATE)
        ),
        open_wo AS (
          SELECT COUNT(*) AS cnt FROM work_orders WHERE status IN ('OPEN', 'IN_PROGRESS', 'WAITING_PARTS')
        ),
        unpaid_inv AS (
          SELECT COUNT(*) AS cnt FROM invoices WHERE status IN ('UNPAID', 'PARTIALLY_PAID')
        )
        SELECT
          (SELECT revenue FROM today_rev) AS revenue_today,
          (SELECT revenue FROM month_rev) AS revenue_month,
          (SELECT cnt FROM open_wo) AS work_orders_open,
          (SELECT cnt FROM unpaid_inv) AS invoices_unpaid
    `);
    return rows[0];
};
