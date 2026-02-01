/**
 * Dashboard Repository
 * Isolates database queries for dashboard statistics
 * Pure data access - no business logic
 */
const { sequelize } = require('../models');
const { Op } = require('sequelize');

class DashboardRepository {
    /**
     * Get summary statistics
     */
    async getSummaryStats() {
        const [results] = await sequelize.query(`
            SELECT 
                (SELECT COUNT(*) FROM work_orders WHERE status = 'OPEN') as open_orders,
                (SELECT COUNT(*) FROM work_orders WHERE status = 'IN_PROGRESS') as in_progress_orders,
                (SELECT COUNT(*) FROM work_orders WHERE status = 'COMPLETED') as completed_orders,
                (SELECT COUNT(*) FROM bookings WHERE status = 'PENDING') as pending_bookings,
                (SELECT COUNT(*) FROM stocks WHERE qty < 10) as low_stock_items,
                (SELECT COALESCE(SUM(total_amount), 0) FROM work_orders WHERE status = 'COMPLETED') as total_revenue,
                (SELECT COALESCE(SUM(total_amount), 0) 
                 FROM work_orders 
                 WHERE status = 'COMPLETED' 
                 AND DATE(updated_at AT TIME ZONE 'Asia/Ho_Chi_Minh') = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')::date) as revenue_today,
                (SELECT COUNT(*) FROM invoices WHERE status = 'UNPAID') as unpaid_invoices
        `);

        return results[0] || {};
    }

    /**
     * Get stock statistics
     */
    async getStockStats() {
        const [results] = await sequelize.query(`
            SELECT 
                COUNT(*) as total_items,
                COALESCE(SUM(qty), 0) as total_quantity,
                COUNT(CASE WHEN qty < 10 THEN 1 END) as low_stock_count,
                COUNT(CASE WHEN qty = 0 THEN 1 END) as out_of_stock_count
            FROM stocks
        `);

        return results[0] || {};
    }

    /**
     * Get stock movement data (last 30 days)
     */
    async getStockMovement(days = 30) {
        const [results] = await sequelize.query(`
            SELECT 
                DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') as date,
                SUM(CASE WHEN type = 'IN' THEN qty ELSE 0 END) as total_in,
                SUM(CASE WHEN type = 'OUT' THEN ABS(qty) ELSE 0 END) as total_out
            FROM stock_entries
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh')
            ORDER BY date DESC
        `);

        return results;
    }

    /**
     * Get low stock items
     */
    async getLowStockItems(limit = 10) {
        const { Stock, Part } = require('../models');
        const { Op } = require('sequelize');

        return await Stock.findAll({
            where: {
                qty: { [Op.lt]: 10 }
            },
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'unit_price', 'sku']
                }
            ],
            order: [['qty', 'ASC']],
            limit
        });
    }

    /**
     * Get recent stock entries
     */
    async getRecentStockEntries(limit = 10) {
        const { StockEntry, Part, User } = require('../models');

        return await StockEntry.findAll({
            limit,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'sku', 'unit_price']
                },
                {
                    model: User,
                    attributes: ['id', 'email'],
                    required: false
                }
            ]
        });
    }
}

module.exports = new DashboardRepository();
