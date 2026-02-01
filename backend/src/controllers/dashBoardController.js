const { dashboardRepo } = require('../repositories');
const { dashboardService } = require('../services');

/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard statistics
 * Follows Clean Architecture: Controller → Service → Repository → Database
 */

// Lấy tổng quan dashboard
exports.summary = async (req, res) => {
    try {
        const stats = await dashboardRepo.getSummaryStats();
        const transformed = dashboardService.transformSummaryStats(stats);
        res.json(transformed);
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy thống kê stock
exports.stockStats = async (req, res) => {
    try {
        const stats = await dashboardRepo.getStockStats();
        const transformed = dashboardService.transformStockStats(stats);
        res.json(transformed);
    } catch (error) {
        console.error('Dashboard stockStats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy stock movement
exports.stockMovement = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const movement = await dashboardRepo.getStockMovement(days);
        const transformed = dashboardService.transformStockMovement(movement);
        res.json(transformed);
    } catch (error) {
        console.error('Dashboard stockMovement error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy top low stock
exports.topLowStock = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const lowStock = await dashboardRepo.getLowStockItems(limit);
        const transformed = dashboardService.transformLowStockItems(lowStock);
        res.json(transformed);
    } catch (error) {
        console.error('Dashboard topLowStock error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy recent stock entries
exports.recentEntries = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const entries = await dashboardRepo.getRecentStockEntries(limit);
        const transformed = dashboardService.transformRecentEntries(entries);
        res.json(transformed);
    } catch (error) {
        console.error('Dashboard recentEntries error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
