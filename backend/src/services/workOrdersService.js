const { work_orders, work_order_items, bookings, stocks, stock_entries, parts_catalog, assignments, sequelize } = require('../models');

// Tạo work order từ booking
exports.createWorkOrderFromBooking = async ({ booking_id, advisor_id, vehicle_id }) => {
    return await work_orders.create({
        booking_id,
        advisor_id,
        vehicle_id,
        status: 'OPEN',
        total_amount: 0
    });
};

// Cập nhật trạng thái booking thành CONFIRMED
exports.updateBookingStatus = async (booking_id, status) => {
    await bookings.update({ status }, { where: { id: booking_id } });
};

// Lấy work order theo ID
exports.getWorkOrderById = async (id) => {
    return await work_orders.findByPk(id, { include: [{ model: work_order_items }] });
};

// Thêm item (Service/Part) vào work order
exports.addItemToWorkOrder = async ({ id, item_type, item_id, quantity, unit_price, user_id }) => {
    await sequelize.transaction(async (t) => {
        let price = unit_price;
        if (!price && item_type === 'PART') {
            const part = await parts_catalog.findByPk(item_id, { transaction: t });
            if (!part) throw new Error('Part not found');
            price = part.unit_price;
        }
        const line_total = Number(price) * Number(quantity);

        await work_order_items.create({
            work_order_id: id,
            item_type,
            item_id,
            quantity,
            unit_price: price,
            line_total
        }, { transaction: t });

        // Nếu là PART -> trừ kho và log OUT
        if (item_type === 'PART') {
            const st = await stocks.findOne({ where: { part_id: item_id }, transaction: t, lock: t.LOCK.UPDATE });
            if (!st || st.qty < quantity) throw new Error('Insufficient stock');
            await st.update({ qty: st.qty - quantity }, { transaction: t });
            await stock_entries.create({
                part_id: item_id,
                qty: quantity,
                type: 'OUT',
                ref: `WO:${id}`,
                created_by: user_id
            }, { transaction: t });
        }

        // Cập nhật tổng tiền work order
        const [sum] = await sequelize.query(
            `SELECT COALESCE(SUM(line_total), 0) AS total FROM work_order_items WHERE work_order_id = :id`,
            { replacements: { id }, transaction: t, type: sequelize.QueryTypes.SELECT }
        );
        await work_orders.update({ total_amount: sum.total }, { where: { id }, transaction: t });
    });
};

// Gán kỹ thuật viên vào work order
exports.assignTechnicianToWorkOrder = async (workOrderId, technician_id) => {
    return await assignments.create({
        work_order_id: workOrderId,
        technician_id,
        status: 'ASSIGNED'
    });
};

// Cập nhật trạng thái work order
exports.updateWorkOrderStatus = async (id, status) => {
    const wo = await work_orders.findByPk(id);
    if (!wo) throw new Error('Work Order not found');
    await wo.update({ status });
    return wo;
};
// Lấy tất cả work orders
exports.listAllWorkOrders = async () => {
    return await work_orders.findAll({
        order: [['scheduled_at', 'ASC']]  
    });
};
// Xóa work order
exports.deleteWorkOrder = async (id) => {
    const row = await work_orders.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return row;
};

