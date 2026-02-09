const { workOrdersRepo, techniciansRepo } = require('../repositories');
const workOrderOrchestrator = require('../orchestrators/workOrder.orchestrator');

// Tạo work order trực tiếp với items (walk-in customer)
exports.create = async (req, res) => {
    const { vehicle_id, technician_id, status, items, start_time, end_time, estimated_duration } = req.body;

    try {
        const wo = await workOrderOrchestrator.createWorkOrderWithItems({
            vehicle_id,
            technician_id,
            status: status || 'OPEN',
            items: items || [],
            user_id: req.user.id,
            start_time: start_time || null,
            end_time: end_time || null,
            estimated_duration: estimated_duration || 90
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
    const { booking_id, technician_id, vehicle_id, items = [], start_time, estimated_duration } = req.body;
    const user_id = req.user?.id || 1;

    console.log('Creating work order from booking:', {
        booking_id,
        technician_id,
        vehicle_id,
        items_count: items.length,
        user_id
    });

    try {
        const wo = await workOrderOrchestrator.createWorkOrderFromBooking({
            booking_id,
            vehicle_id,
            technician_id,
            items,
            user_id,
            start_time,
            estimated_duration
        });

        console.log('Work order created successfully:', { id: wo?.id, status: wo?.status });

        res.status(201).json(wo);
    } catch (error) {
        console.error('Error creating work order from booking:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: error.message || 'Failed to create work order',
            error: error.message
        });
    }
};

// Lấy chi tiết work order
exports.get = async (req, res) => {
    const { id } = req.params;
    try {
        const wo = await workOrdersRepo.findById(id);
        if (!wo) return res.status(404).json({ message: 'Not found' });

        const plainWo = wo.get({ plain: true });

        // Get customer info from booking or vehicle
        const customerInfo = plainWo.Booking?.Customer || plainWo.Vehicle?.Customer || null;

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
            customer_id: customerInfo?.id || null,
            start_time: plainWo.start_time,
            end_time: plainWo.end_time,
            estimated_duration: plainWo.estimated_duration,
            items: plainWo.WorkOrderItems || [],
            // Full customer and vehicle objects for edit form
            customerDetails: customerInfo ? {
                id: customerInfo.id,
                name: customerInfo.name,
                phone: customerInfo.phone,
                email: customerInfo.email || '',
                address: customerInfo.address || ''
            } : null,
            vehicleDetails: plainWo.Vehicle ? {
                id: plainWo.Vehicle.id,
                license_plate: plainWo.Vehicle.license_plate,
                model: plainWo.Vehicle.model,
                vin: plainWo.Vehicle.vin || '',
                mileage: plainWo.Vehicle.mileage || '',
                note: plainWo.Vehicle.note || ''
            } : null
        };

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật work order
exports.update = async (req, res) => {
    const { id } = req.params;
    const { vehicle_id, technician_id, status, items, start_time, end_time, estimated_duration } = req.body;
    console.log('=== UPDATE WORK ORDER REQUEST ===');
    console.log('ID:', id);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);

    try {
        const wo = await workOrderOrchestrator.updateWorkOrderWithItems({
            work_order_id: id,
            vehicle_id,
            technician_id,
            status: status || 'OPEN',
            items: items || [],
            user_id: req.user.id,
            start_time: start_time || null,
            end_time: end_time || null,
            estimated_duration: estimated_duration || 90
        });
        res.json(wo);
    } catch (error) {
        console.error('=== ERROR UPDATING WORK ORDER ===');
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

// Thêm item (Service/Part) vào work order
exports.addItem = async (req, res) => {
    const { id } = req.params;
    const { item_type, item_id, quantity = 1, unit_price, description } = req.body;
    try {
        await workOrderOrchestrator.addItemToWorkOrder({
            work_order_id: id,
            item_type,
            item_id,
            quantity,
            unit_price,
            description,
            user_id: req.user.id
        });
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
        const wo = await workOrderOrchestrator.assignTechnicianToWorkOrder(id, technician_id);
        res.status(201).json(wo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật trạng thái work order
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        // If status is COMPLETED, use orchestrator to free technician
        if (status === 'COMPLETED') {
            const wo = await workOrderOrchestrator.completeWorkOrder(id);
            return res.json(wo);
        }

        // For IN_PROGRESS, mark technician as BUSY
        const workOrder = await workOrdersRepo.findById(id);
        if (!workOrder) return res.status(404).json({ message: 'Work order not found' });

        await workOrdersRepo.updateStatus(id, status);

        if (status === 'IN_PROGRESS' && workOrder.technician_id) {
            await techniciansRepo.updateAvailability(workOrder.technician_id, false);
        }

        const wo = await workOrdersRepo.findById(id);
        res.json(wo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy tất cả work orders
exports.listAll = async (req, res) => {
    try {
        const rows = await workOrdersRepo.findAll();
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
        const deleted = await workOrdersRepo.delete(id);
        if (!deleted) return res.status(404).json({ message: 'Work Order not found' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get work order statistics
exports.getStats = async (req, res) => {
    try {
        const stats = await workOrdersRepo.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
