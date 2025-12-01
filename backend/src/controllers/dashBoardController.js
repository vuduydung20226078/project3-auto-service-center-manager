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
