const { Stock, StockEntry, Part, sequelize } = require('../models');

// Lấy tất cả stock
exports.listStocks = async () => {
    return await Stock.findAll({
        include: [
            {
                model: Part,
                attributes: ['id', 'sku', 'name', 'unit', 'unit_price']
            }
        ],
        order: [['updated_at', 'DESC']]
    });
};

// Thêm entry vào stock (nhập/xuất)
exports.addStockEntry = async ({ part_id, qty, type, ref_type, user_id, location, target_location }) => {
    await sequelize.transaction(async (t) => {
        // Xử lý đặc biệt cho ADJ (Adjustment) - di chuyển giữa các kệ
        if (ref_type === 'ADJ') {
            if (!location || !target_location) {
                throw new Error('ADJ requires both source location and target location');
            }
            if (location === target_location) {
                throw new Error('Source and target locations must be different');
            }

            // Tìm stock tại location nguồn
            const sourceSt = await Stock.findOne({
                where: { part_id, location },
                transaction: t,
                lock: t.LOCK.UPDATE
            });
            if (!sourceSt) throw new Error(`Stock not found at location ${location}`);
            if (sourceSt.qty < qty) throw new Error(`Insufficient stock at ${location}. Available: ${sourceSt.qty}`);
            // Giảm qty tại location nguồn
            await sourceSt.update({
                qty: sourceSt.qty - qty
            }, { transaction: t });

            // Tạo entry OUT
            await StockEntry.create({
                part_id, qty, type: 'OUT', ref_type,
                created_by: user_id
            }, { transaction: t });

            // Tìm hoặc tạo stock tại location đích
            let targetSt = await Stock.findOne({
                where: { part_id, location: target_location },
                transaction: t,
                lock: t.LOCK.UPDATE
            });
            if (!targetSt) {
                targetSt = await Stock.create({
                    part_id,
                    qty: 0,
                    location: target_location
                }, { transaction: t });
            }

            // Tăng qty tại location đích
            await targetSt.update({
                qty: targetSt.qty + qty
            }, { transaction: t });

            // Tạo entry IN
            await StockEntry.create({
                part_id, qty, type: 'IN', ref_type,
                created_by: user_id
            }, { transaction: t });

            return; // Kết thúc xử lý ADJ
        }

        // Xử lý các loại entry khác (RET, PO, WO, INV, DAMAGED, LOST, MANUAL)
        let st = await Stock.findOne({
            where: { part_id, location: location || 'Default' },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!st) {
            // Tạo stock record mới nếu chưa có
            st = await Stock.create({
                part_id,
                qty: 0,
                location: location || 'Default'
            }, { transaction: t });
        }

        // Tính số lượng mới
        const newQty = type === 'IN' ? st.qty + qty : st.qty - qty;
        if (newQty < 0) throw new Error(`Insufficient stock at ${st.location}. Available: ${st.qty}, Requested: ${qty}`);

        // Cập nhật số lượng
        await st.update({
            qty: newQty
        }, { transaction: t });

        // Ghi lại entry
        await StockEntry.create({
            part_id,
            qty,
            type,
            ref_type: ref_type || 'MANUAL',
            created_by: user_id
        }, { transaction: t });
    });
};

// Lấy các phần có số lượng kho thấp
exports.getLowStock = async () => {
    return await sequelize.query(`
        SELECT p.id, p.name, s.qty
        FROM parts_catalog p
        JOIN stocks s ON s.part_id = p.id
        WHERE s.qty <= 5
        ORDER BY s.qty ASC
    `, { type: sequelize.QueryTypes.SELECT });
};
