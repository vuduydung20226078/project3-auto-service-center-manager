const workOrdersService = require('../services/workOrdersService'); // Import service

// Tạo work order từ booking
exports.createFromBooking = async (req, res) => {
    const { booking_id, advisor_id, vehicle_id } = req.body;
    try {
        const wo = await workOrdersService.createWorkOrderFromBooking({ booking_id, advisor_id, vehicle_id });
        // Link booking và tự động cập nhật trạng thái là CONFIRMED
        await workOrdersService.updateBookingStatus(booking_id, 'CONFIRMED');
        res.status(201).json(wo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết work order
exports.get = async (req, res) => {
    const { id } = req.params;
    try {
        const wo = await workOrdersService.getWorkOrderById(id);
        if (!wo) return res.status(404).json({ message: 'Not found' });
        res.json(wo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm item (Service/Part) vào work order
exports.addItem = async (req, res) => {
    const { id } = req.params; // work_order_id
    const { item_type, item_id, quantity = 1, unit_price } = req.body;
    try {
        await workOrdersService.addItemToWorkOrder({ id, item_type, item_id, quantity, unit_price, user_id: req.user.id });
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Gán kỹ thuật viên vào work order
exports.assignTech = async (req, res) => {
    const { id } = req.params;
    const { technician_id } = req.body;
    try {
        const row = await workOrdersService.assignTechnicianToWorkOrder(id, technician_id);
        res.status(201).json(row);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật trạng thái work order
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // OPEN, IN_PROGRESS, WAITING_PARTS, COMPLETED, CLOSED
    try {
        const wo = await workOrdersService.updateWorkOrderStatus(id, status);
        res.json(wo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Lấy tất cả work orders
exports.listAll = async (req, res) => {
    try {
        const rows = await workOrdersService.listAllWorkOrders();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Xóa work order
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const row = await workOrdersService.deleteWorkOrder(id);
        if (!row) return res.status(404).json({ message: 'Work Order not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

