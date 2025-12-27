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

// Lấy thống kê stock
exports.getStockStats = async () => {
  const [rows] = await sequelize.query(`
        SELECT
          COUNT(DISTINCT s.part_id) AS total_parts,
          COALESCE(SUM(s.qty), 0) AS total_quantity,
          COUNT(*) FILTER (WHERE s.qty = 0) AS out_of_stock,
          COUNT(*) FILTER (WHERE s.qty > 0 AND s.qty <= 5) AS low_stock
        FROM stocks s
    `);
  return rows[0];
};

// Lấy stock movement 7 ngày gần đây
exports.getStockMovement = async () => {
  const movements = await sequelize.query(`
        SELECT
          DATE(se.created_at) AS date,
          se.type,
          COUNT(*) AS count,
          SUM(se.qty) AS quantity
        FROM stock_entries se
        WHERE se.created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(se.created_at), se.type
        ORDER BY date DESC, se.type
    `, { type: sequelize.QueryTypes.SELECT });
  return movements;
};

// Lấy top low stock parts
exports.getTopLowStock = async (limit = 10) => {
  const lowStock = await sequelize.query(`
        SELECT
          p.id,
          p.sku,
          p.name,
          s.location,
          s.qty,
          p.unit
        FROM stocks s
        JOIN parts_catalog p ON p.id = s.part_id
        WHERE s.qty <= 5
        ORDER BY s.qty ASC, p.name
        LIMIT :limit
    `, {
    replacements: { limit },
    type: sequelize.QueryTypes.SELECT
  });
  return lowStock;
};

// Lấy recent stock entries
exports.getRecentStockEntries = async (limit = 10) => {
  const entries = await sequelize.query(`
        SELECT
          se.id,
          se.part_id,
          p.sku,
          p.name AS part_name,
          se.qty,
          se.type,
          se.ref_type,
          se.created_at,
          u.username AS created_by
        FROM stock_entries se
        JOIN parts_catalog p ON p.id = se.part_id
        LEFT JOIN users u ON u.id = se.created_by
        ORDER BY se.created_at DESC
        LIMIT :limit
    `, {
    replacements: { limit },
    type: sequelize.QueryTypes.SELECT
  });
  return entries;
};
