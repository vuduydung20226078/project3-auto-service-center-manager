const dashboardService = require('../services/dashboardService'); // Import service

// Lấy tổng quan dashboard
exports.summary = async (req, res) => {
    try {
        const summary = await dashboardService.getDashboardSummary();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy thống kê stock
exports.stockStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStockStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy stock movement
exports.stockMovement = async (req, res) => {
    try {
        const movement = await dashboardService.getStockMovement();
        res.json(movement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy top low stock
exports.topLowStock = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const lowStock = await dashboardService.getTopLowStock(limit);
        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy recent stock entries
exports.recentEntries = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const entries = await dashboardService.getRecentStockEntries(limit);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
