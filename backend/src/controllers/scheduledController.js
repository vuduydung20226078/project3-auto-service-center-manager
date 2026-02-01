const { buildLocalDayRange } = require('../ultils/convertLocalDate');
const { workOrdersRepo, techniciansRepo } = require('../repositories');

// @desc    Get technician work orders
// @route   GET /api/technician/work-orders
// @access  Private (Technician only)
exports.getWorkOrders = async (req, res) => {
    try {
        const { status, date } = req.query;
        const technicianId = req.user.id;

        // Find technician record via repo
        const technician = await techniciansRepo.findByUserId(technicianId);

        if (!technician) {
            return res.status(404).json({ message: 'Technician profile not found' });
        }

        // Use repository to get work orders (it will include vehicle + customer)
        if (date) {
            const { start, end } = buildLocalDayRange(date);
            const workOrders = await workOrdersRepo.findByTechnicianAndRange(technician.id, start, end);
            return res.json(workOrders);
        }

        // No date filter: fetch all for technician (repo.findAll can be filtered by technician_id)
        const rows = await workOrdersRepo.findAll({ technician_id: technician.id, status });
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching work orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get work order detail
// @route   GET /api/technician/work-orders/:id
// @access  Private (Technician only)
exports.getWorkOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const technicianId = req.user.id;

        // Find technician record via repo
        const technician = await techniciansRepo.findByUserId(technicianId);

        if (!technician) {
            return res.status(404).json({ message: 'Technician profile not found' });
        }


        const workOrder = await workOrdersRepo.findById(id);

        // ensure technician owns this WO
        if (!workOrder || workOrder.technician_id !== technician.id) {
            return res.status(404).json({ message: 'Work order not found' });
        }

        res.json(workOrder);
    } catch (error) {
        console.error('Error fetching work order detail:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update work order status
// @route   PATCH /api/technician/work-orders/:id/status
// @access  Private (Technician only)
exports.updateWorkOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const technicianId = req.user.id;

        // Normalize and validate status
        let newStatus = status;
        // DB enum for work_orders does not include 'CANCELLED' - map it to 'CLOSED'
        if (status === 'CANCELLED') newStatus = 'CLOSED';

        const validStatuses = ['PENDING', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CLOSED'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find technician
        const technician = await techniciansRepo.findByUserId(technicianId);
        if (!technician) return res.status(404).json({ message: 'Technician profile not found' });

        // Ensure work order belongs to technician
        const workOrder = await workOrdersRepo.findById(id);
        if (!workOrder || workOrder.technician_id !== technician.id) {
            return res.status(404).json({ message: 'Work order not found' });
        }

        // Prepare update fields
        if (status === 'IN_PROGRESS' && !workOrder.actual_start) {
            await workOrdersRepo.updateStatus(id, 'IN_PROGRESS');
            await workOrdersRepo.updateEndTime(id, workOrder.end_time || null);
            // mark technician BUSY
            await techniciansRepo.updateAvailability(technician.id, false);
        } else if (status === 'COMPLETED') {
            // use orchestrator flow to complete
            const updated = await require('../orchestrators/workOrder.orchestrator').completeWorkOrder(id);
            return res.json({ message: 'Work order status updated successfully', workOrder: updated });
        } else {
            await workOrdersRepo.updateStatus(id, newStatus);
        }

        const updatedWo = await workOrdersRepo.findById(id);
        res.json({ message: 'Work order status updated successfully', workOrder: updatedWo });
    } catch (error) {
        console.error('Error updating work order status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update technician notes
// @route   PATCH /api/technician/work-orders/:id/notes
// @access  Private (Technician only)
exports.updateTechnicianNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const technicianId = req.user.id;

        // Find technician via repo
        const technician = await techniciansRepo.findByUserId(technicianId);
        if (!technician) return res.status(404).json({ message: 'Technician profile not found' });

        const workOrder = await workOrdersRepo.findById(id);
        if (!workOrder || workOrder.technician_id !== technician.id) {
            return res.status(404).json({ message: 'Work order not found' });
        }

        await workOrdersRepo.update(id, { technician_notes: notes });

        const updated = await workOrdersRepo.findById(id);
        res.json({ message: 'Notes updated successfully', workOrder: updated });
    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get technician statistics
// @route   GET /api/technician/stats
// @access  Private (Technician only)
exports.getStats = async (req, res) => {
    try {
        const technicianId = req.user.id;

        // Find technician via repo
        const technician = await techniciansRepo.findByUserId(technicianId);
        if (!technician) return res.status(404).json({ message: 'Technician profile not found' });

        // Get today's date range
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const { start, end } = buildLocalDayRange(todayStr);

        // Use repository to fetch work orders in range then compute counts here
        const rows = await workOrdersRepo.findByTechnicianAndRange(technician.id, start, end);
        const total = rows.length;
        const inProgress = rows.filter(r => r.status === 'IN_PROGRESS').length;
        const completed = rows.filter(r => r.status === 'COMPLETED').length;

        res.json({ total, inProgress, completed });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
