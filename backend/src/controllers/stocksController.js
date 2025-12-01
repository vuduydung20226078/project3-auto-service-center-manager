const stocksService = require('../services/stocksService'); // Import service

// Lấy tất cả stock
exports.list = async (req, res) => {
    try {
        const rows = await stocksService.listStocks();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm entry vào stock (nhập/xuất)
exports.addEntry = async (req, res) => {
    const { part_id, qty, type, ref } = req.body; // type: IN/OUT
    try {
        await stocksService.addStockEntry({ part_id, qty, type, ref, user_id: req.user.id });
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy các phần có số lượng kho thấp
exports.low = async (req, res) => {
    try {
        const rows = await stocksService.getLowStock();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
