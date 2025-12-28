const { WorkOrder, WorkOrderItem, Booking, Stock, StockEntry, PartsCatalog, ServicesCatalog, Assignment, User, Vehicle, Technician, Customer, sequelize } = require('../models');

// Tạo work order trực tiếp với items (walk-in customer)
exports.createWorkOrderWithItems = async ({ vehicle_id, technician_id, status, items, user_id }) => {
    return await sequelize.transaction(async (t) => {
        // Tạo work order
        const wo = await WorkOrder.create({
            booking_id: null,
            technician_id: technician_id || null,
            vehicle_id,
            status: status || 'OPEN',
            total_amount: 0
        }, { transaction: t });

        let totalAmount = 0;

        // Thêm items (services và parts)
        for (const item of items) {
            const quantity = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || 0;
            const line_total = price * quantity;
            totalAmount += line_total;

            // Xác định item_type và item_id
            const item_type = item.type.toUpperCase(); // 'SERVICE' hoặc 'PART'
            const item_id = parseInt(item.type.toLowerCase() === 'service' ? item.service_id : item.part_id);

            if (!item_id) {
                throw new Error(`Invalid item_id for type ${item.type}`);
            }

            await WorkOrderItem.create({
                work_order_id: wo.id,
                item_type,
                item_id,
                description: item.description || null,
                quantity,
                unit_price: price,
                line_total
            }, { transaction: t });

            // Nếu là PART -> trừ kho
            if (item_type === 'PART') {
                const stock = await Stock.findOne({
                    where: { part_id: item_id },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                if (stock && stock.qty >= quantity) {
                    await stock.update({ qty: stock.qty - quantity }, { transaction: t });

                    await StockEntry.create({
                        part_id: item_id,
                        qty: quantity,
                        type: 'OUT',
                        ref: `WO:${wo.id}`,
                        created_by: user_id
                    }, { transaction: t });
                }
            }
        }

        // Cập nhật tổng tiền
        await wo.update({ total_amount: totalAmount }, { transaction: t });

        // Cập nhật trạng thái technician thành BUSY nếu có
        if (technician_id) {
            await Technician.update(
                { status: 'BUSY' },
                { where: { id: technician_id }, transaction: t }
            );
        }

        return wo;
    });
};

// Tạo work order từ booking
exports.createWorkOrderFromBooking = async ({ booking_id, technician_id, vehicle_id }) => {
    return await WorkOrder.create({
        booking_id,
        technician_id,
        vehicle_id,
        status: 'OPEN',
        total_amount: 0
    });
};

// Cập nhật trạng thái booking thành CONFIRMED
exports.updateBookingStatus = async (booking_id, status) => {
    await Booking.update({ status }, { where: { id: booking_id } });
};

// Lấy work order theo ID với đầy đủ thông tin
exports.getWorkOrderById = async (id) => {
    return await WorkOrder.findByPk(id, {
        include: [
            { model: WorkOrderItem },
            {
                model: Technician,
                include: [{ model: User, attributes: ['id', 'full_name', 'email'] }]
            },
            {
                model: Vehicle,
                attributes: ['id', 'license_plate', 'model', 'vin', 'mileage'],
                include: [{ model: Customer, attributes: ['id', 'name', 'phone', 'email'] }]
            },
            {
                model: Booking,
                attributes: ['id'],
                include: [
                    { model: Customer, attributes: ['id', 'name', 'phone', 'email'] }
                ]
            },
            

        ]
    });
};

// Thêm item (Service/Part) vào work order
exports.addItemToWorkOrder = async ({ id, item_type, item_id, quantity, unit_price, user_id }) => {
    await sequelize.transaction(async (t) => {
        let price = unit_price;
        if (!price && item_type === 'PART') {
            const part = await PartsCatalog.findByPk(item_id, { transaction: t });
            if (!part) throw new Error('Part not found');
            price = part.unit_price;
        }
        const line_total = Number(price) * Number(quantity);

        await WorkOrderItem.create({
            work_order_id: id,
            item_type,
            item_id,
            quantity,
            unit_price: price,
            line_total
        }, { transaction: t });

        // Nếu là PART -> trừ kho và log OUT
        if (item_type === 'PART') {
            const st = await Stock.findOne({ where: { part_id: item_id }, transaction: t, lock: t.LOCK.UPDATE });
            if (!st || st.qty < quantity) throw new Error('Insufficient stock');
            await st.update({ qty: st.qty - quantity }, { transaction: t });
            await StockEntry.create({
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
        await WorkOrder.update({ total_amount: sum.total }, { where: { id }, transaction: t });
    });
};

// Gán kỹ thuật viên vào work order
exports.assignTechnicianToWorkOrder = async (workOrderId, technician_id) => {
    return await Assignment.create({
        work_order_id: workOrderId,
        technician_id,
        status: 'ASSIGNED'
    });
};

// Cập nhật trạng thái work order
exports.updateWorkOrderStatus = async (id, status) => {
    const wo = await WorkOrder.findByPk(id);
    if (!wo) throw new Error('Work Order not found');
    await wo.update({ status });
    return wo;
};
// Lấy tất cả work orders
exports.listAllWorkOrders = async () => {
    return await WorkOrder.findAll({
        include: [
            {
                model: Technician,
                include: [{ model: User, attributes: ['id', 'full_name'] }]
            },
            {
                model: Vehicle,
                attributes: ['id', 'license_plate', 'model'],
                include: [{ model: Customer, attributes: ['id', 'name'] }]
            },
            {
                model: Booking,
                attributes: ['id'],
                include: [
                    { model: Customer, attributes: ['id', 'name'] }
                ]
            }
        ],
        order: [['created_at', 'DESC']]
    });
};
// Xóa work order
exports.deleteWorkOrder = async (id) => {
    const row = await WorkOrder.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return row;
};

// Get work order statistics
exports.getWorkOrderStats = async () => {
    const [activeOrders] = await sequelize.query(
        `SELECT COUNT(*) as count FROM work_orders WHERE status IN ('IN_PROGRESS', 'WAITING_PARTS')`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const [pendingOrders] = await sequelize.query(
        `SELECT COUNT(*) as count FROM work_orders WHERE status = 'OPEN'`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const [revenue] = await sequelize.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total FROM work_orders WHERE status = 'COMPLETED'`,
        { type: sequelize.QueryTypes.SELECT }
    );

    // Parse revenue as number, handle string or numeric from DB
    const totalRevenue = Number(revenue.total) || 0;

    return {
        activeOrders: parseInt(activeOrders.count) || 0,
        pendingOrders: parseInt(pendingOrders.count) || 0,
        totalRevenue: totalRevenue
    };
};

