const { stocksRepo } = require('../repositories');

// Lấy tất cả stock
exports.list = async (req, res) => {
    try {
        const rows = await stocksRepo.findAll();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm entry vào stock (nhập/xuất)
exports.addEntry = async (req, res) => {
    const { part_id, qty, type, ref_type, location, target_location } = req.body;
    try {
        const entryData = {
            part_id,
            quantity_change: type === 'IN' ? qty : -qty,
            entry_type: type,
            ref_type,
            location,
            target_location,
            notes: null,
            performed_by: req.user.id
        };

        await stocksRepo.createEntry(entryData);

        // Update stock quantity
        if (type === 'IN') {
            await stocksRepo.incrementQuantity(part_id, qty, `Stock entry: ${ref_type}`, req.user.id);
        } else {
            await stocksRepo.decrementQuantity(part_id, qty, `Stock entry: ${ref_type}`, req.user.id);
        }

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
        const rows = await stocksRepo.findLowStock();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa stock (chỉ cho phép khi qty = 0)
exports.deleteStock = async (req, res) => {
    const { part_id, location } = req.params;
    try {
        const stock = await stocksRepo.findByPartId(parseInt(part_id));
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        if (stock.quantity_available > 0) {
            return res.status(400).json({ message: 'Cannot delete stock with quantity > 0' });
        }

        const deleted = await stocksRepo.delete(parseInt(part_id), location);
        res.json({ success: true, message: 'Stock deleted successfully' });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('Cannot delete') ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};
