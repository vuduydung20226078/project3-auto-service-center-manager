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
    const { part_id, qty, type, ref_type, location, target_location } = req.body;
    try {
        await stocksService.addStockEntry({
            part_id,
            qty,
            type,
            ref_type,
            location,
            target_location,
            user_id: req.user.id
        });
        console.log(req.user.id);
        let message = 'Stock entry created successfully';
        if (ref_type === 'ADJ') {
            message = `Adjusted ${qty} items from ${location} to ${target_location}`;
        } else if (type === 'IN') {
            message = `Added ${qty} items to stock`;
        } else {
            message = `Removed ${qty} items from stock`;
        }

        res.status(201).json({ success: true, message });
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
