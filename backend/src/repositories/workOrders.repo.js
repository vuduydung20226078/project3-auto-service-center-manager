/**
 * Work Orders Repository
 * Isolates Sequelize queries from service layer
 */
const { WorkOrder, WorkOrderItem, Vehicle, Technician, Booking, Service, Part, User, Customer } = require('../models');
const { Op } = require('sequelize');

class WorkOrdersRepository {
    /**
     * Create a new work order
     */
    async create(data, transaction = null) {
        return await WorkOrder.create(data, { transaction });
    }

    /**
     * Find work order by ID
     */
    async findById(id) {
        return await WorkOrder.findByPk(id, {
            include: [
                {
                    model: Vehicle,
                    attributes: ['id', 'license_plate', 'make', 'model'],
                    include: [
                        { model: Customer, attributes: ['id', 'name', 'phone', 'email'] }
                    ]
                },
                {
                    model: Technician,
                    attributes: ['id'],
                    include: [
                        { model: User, attributes: ['id', 'full_name'] }
                    ]
                },
                {
                    model: WorkOrderItem,
                    include: [
                        { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
                        { model: Part, as: 'part', attributes: ['id', 'name', 'unit_price'] }
                    ]
                },
                {
                    model: Booking,
                    attributes: ['id', 'scheduled_at', 'notes'],
                    include: [
                        { model: Customer, attributes: ['id', 'name', 'phone', 'email'] }
                    ]
                }
            ]
        });
    }

    /**
     * Find all work orders
     */
    async findAll({ technician_id, status, from, to } = {}) {
        const where = {};

        if (technician_id) where.technician_id = technician_id;
        if (status) where.status = status;
        if (from || to) {
            where.start_time = {};
            if (from) where.start_time[Op.gte] = new Date(from);
            if (to) where.start_time[Op.lte] = new Date(to);
        }

        return await WorkOrder.findAll({
            where,
            include: [
                {
                    model: Vehicle,
                    attributes: ['id', 'license_plate', 'make', 'model'],
                    include: [
                        { model: Customer, attributes: ['name'] }
                    ]
                },
                {
                    model: Technician,
                    attributes: ['id'],
                    include: [
                        { model: User, attributes: ['id', 'full_name'] }
                    ]
                },
                {
                    model: WorkOrderItem,
                    include: [
                        { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
                        { model: Part, as: 'part', attributes: ['id', 'name', 'unit_price'] }
                    ]
                }
                ,
                {
                    model: Booking,
                    attributes: ['id', 'scheduled_at'],
                    include: [
                        { model: Customer, attributes: ['name'] }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    /**
     * Update work order
     */
    async update(id, data, transaction = null) {
        const workOrder = await WorkOrder.findByPk(id);
        if (!workOrder) return null;

        await workOrder.update(data, { transaction });
        return workOrder;
    }

    /**
     * Update work order status
     */
    async updateStatus(id, status, transaction = null) {
        const workOrder = await WorkOrder.findByPk(id);
        if (!workOrder) return null;

        // Map external 'CANCELLED' to DB enum 'CLOSED'
        const newStatus = status === 'CANCELLED' ? 'CLOSED' : status;

        await workOrder.update({ status: newStatus }, { transaction });
        return workOrder;
    }

    /**
     * Update work order technician
     */
    async updateTechnician(id, technician_id, transaction = null) {
        const workOrder = await WorkOrder.findByPk(id);
        if (!workOrder) return null;

        await workOrder.update({ technician_id }, { transaction });
        return workOrder;
    }

    /**
     * Update work order total amount
     */
    async updateTotalAmount(id, total_amount, transaction = null) {
        const workOrder = await WorkOrder.findByPk(id);
        if (!workOrder) return null;

        await workOrder.update({ total_amount }, { transaction });
        return workOrder;
    }

    /**
     * Update work order end time
     */
    async updateEndTime(id, end_time, transaction = null) {
        const workOrder = await WorkOrder.findByPk(id);
        if (!workOrder) return null;

        await workOrder.update({ end_time }, { transaction });
        return workOrder;
    }

    /**
     * Get work order statistics
     */
    async getStats() {
        const { sequelize } = require('../models');

        const [results] = await sequelize.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as open,
                COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress,
                COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'CLOSED' THEN 1 END) as cancelled,
                COALESCE(SUM(total_amount), 0) as total_revenue
            FROM work_orders
        `);

        return results[0] || {};
    }

    /**
     * Delete work order
     */
    async delete(id, transaction = null) {
        const workOrder = await WorkOrder.findByPk(id);
        if (!workOrder) return null;

        await workOrder.destroy({ transaction });
        return workOrder;
    }

    /**
     * Create work order item
     */
    async createItem(data, transaction = null) {
        return await WorkOrderItem.create(data, { transaction });
    }

    /**
     * Update work order item
     */
    async updateItem(id, data, transaction = null) {
        const item = await WorkOrderItem.findByPk(id);
        if (!item) return null;

        await item.update(data, { transaction });
        return item;
    }

    /**
     * Delete work order item
     */
    async deleteItem(id, transaction = null) {
        const item = await WorkOrderItem.findByPk(id);
        if (!item) return null;

        await item.destroy({ transaction });
        return item;
    }

    /**
     * Find items by work order ID
     */
    async findItemsByWorkOrderId(workOrderId) {
        return await WorkOrderItem.findAll({
            where: { work_order_id: workOrderId },
            include: [
                { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
                { model: Part, as: 'part', attributes: ['id', 'name', 'unit_price'] }
            ]
        });
    }

    /**
     * Find technician ids that have overlapping work orders in a time slot
     */
    async findTechnicianIdsWithOverlappingSlot(start, end) {
        const overlapping = await WorkOrder.findAll({
            where: {
                start_time: { [Op.lt]: end },
                end_time: { [Op.gt]: start }
            },
            attributes: ['technician_id'],
            group: ['technician_id']
        });

        return overlapping.map(r => r.technician_id).filter(Boolean);
    }

    /**
     * Find work orders for a technician within a date range, include vehicle + customer
     */
    async findByTechnicianAndRange(technicianId, from, to) {
        return await WorkOrder.findAll({
            where: {
                technician_id: technicianId,
                start_time: { [Op.gte]: from },
                start_time: { [Op.lte]: to }
            },
            attributes: ['id', 'start_time', 'end_time', 'status', 'vehicle_id', 'booking_id', 'total_amount'],
            include: [
                {
                    model: Vehicle,
                    attributes: ['id', 'license_plate', 'make', 'model', 'year', 'mileage'],
                    include: [
                        { model: Customer, attributes: ['id', 'name', 'phone'] }
                    ]
                }
            ]
        });
    }
}

module.exports = new WorkOrdersRepository();
