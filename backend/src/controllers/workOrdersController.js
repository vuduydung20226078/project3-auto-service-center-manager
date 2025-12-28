const workOrdersService = require('../services/workOrdersService');

// Tạo work order trực tiếp với items (walk-in customer)
exports.create = async (req, res) => {
    const { vehicle_id, technician_id, status, items } = req.body;
    console.log('=== CREATE WORK ORDER REQUEST ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);

    try {
        const wo = await workOrdersService.createWorkOrderWithItems({
            vehicle_id,
            technician_id,
            status: status || 'OPEN',
            items: items || [],
            user_id: req.user.id
        });
        res.status(201).json(wo);
    } catch (error) {
        console.error('=== ERROR CREATING WORK ORDER ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.errors || null
        });
    }
};

// Tạo work order từ booking
exports.createFromBooking = async (req, res) => {
    const { booking_id, technician_id, vehicle_id } = req.body;
    try {
        const wo = await workOrdersService.createWorkOrderFromBooking({ booking_id, technician_id, vehicle_id });
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

        const plainWo = wo.get({ plain: true });

        const formatted = {
            id: plainWo.id,
            customer: plainWo.Booking?.Customer?.name || plainWo.Vehicle?.Customer?.name || 'Walk-in',
            vehicle: plainWo.Vehicle ? `${plainWo.Vehicle.model} - ${plainWo.Vehicle.license_plate}` : 'N/A',
            technician: plainWo.Technician?.User?.full_name || 'Unassigned',
            total_amount: plainWo.total_amount,
            status: plainWo.status,
            created_at: plainWo.created_at || plainWo.createdAt,
            booking_id: plainWo.booking_id,
            technician_id: plainWo.technician_id,
            vehicle_id: plainWo.vehicle_id,
            items: plainWo.WorkOrderItems || []
        };

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm item (Service/Part) vào work order
exports.addItem = async (req, res) => {
    const { id } = req.params;
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
    const { status } = req.body;
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
        const formatted = rows.map(wo => {
            const plainWo = wo.get({ plain: true });
            return {
                id: plainWo.id,
                customer: plainWo.Booking?.Customer?.name || plainWo.Vehicle?.Customer?.name || 'Walk-in',
                vehicle: plainWo.Vehicle ? `${plainWo.Vehicle.model} - ${plainWo.Vehicle.license_plate}` : 'N/A',
                technician: plainWo.Technician?.User?.full_name || 'Unassigned',
                total_amount: plainWo.total_amount,
                status: plainWo.status,
                created_at: plainWo.created_at || plainWo.createdAt,
                booking_id: plainWo.booking_id,
                technician_id: plainWo.technician_id,
                vehicle_id: plainWo.vehicle_id
            };
        });
        res.json(formatted);
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

// Get work order statistics
exports.getStats = async (req, res) => {
    try {
        const stats = await workOrdersService.getWorkOrderStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
