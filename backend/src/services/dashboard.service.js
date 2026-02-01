/**
 * Dashboard Service
 * Business logic for dashboard data transformation
 */
class DashboardService {
    /**
     * Transform summary stats to frontend format
     */
    transformSummaryStats(data) {
        return {
            revenue_today: parseFloat(data.revenue_today) || 0,
            revenue_month: parseFloat(data.total_revenue) || 0,
            work_orders_open: parseInt(data.open_orders) || 0,
            invoices_unpaid: parseInt(data.unpaid_invoices) || 0
        };
    }

    /**
     * Transform stock stats to frontend format
     */
    transformStockStats(data) {
        return {
            total_parts: parseInt(data.total_items) || 0,
            total_quantity: parseInt(data.total_quantity) || 0,
            low_stock: parseInt(data.low_stock_count) || 0,
            out_of_stock: parseInt(data.out_of_stock_count) || 0
        };
    }

    /**
     * Transform stock movement to frontend format
     */
    transformStockMovement(data) {
        return data.map(item => ({
            date: item.date,
            type: 'IN', // Will be split into two entries
            quantity: parseInt(item.total_in) || 0
        })).concat(
            data.map(item => ({
                date: item.date,
                type: 'OUT',
                quantity: parseInt(item.total_out) || 0
            }))
        );
    }

    /**
     * Transform low stock items to frontend format
     */
    transformLowStockItems(items) {
        return items.map(stock => ({
            sku: stock.Part?.sku || 'N/A',
            name: stock.Part?.name || 'Unknown',
            location: stock.location || 'Default',
            qty: parseInt(stock.qty) || 0
        }));
    }

    /**
     * Transform recent stock entries to frontend format
     */
    transformRecentEntries(entries) {
        return entries.map(entry => ({
            id: entry.id,
            created_at: entry.created_at,
            sku: entry.Part?.sku || 'N/A',
            part_name: entry.Part?.name || 'Unknown',
            type: entry.type,
            qty: Math.abs(parseInt(entry.qty) || 0),
            ref_type: entry.ref_type || 'MANUAL',
            created_by: entry.User?.email || entry.created_by || null
        }));
    }
}

module.exports = new DashboardService();
