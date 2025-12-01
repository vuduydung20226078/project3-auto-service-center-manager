const { stocks, stock_entries, sequelize } = require('../models');

// Lấy tất cả stock
exports.listStocks = async () => {
    return await stocks.findAll({ order: [['last_updated', 'DESC']] });
};

// Thêm entry vào stock (nhập/xuất)
exports.addStockEntry = async ({ part_id, qty, type, ref, user_id }) => {
    await sequelize.transaction(async (t) => {
        const st = await stocks.findOne({ where: { part_id }, transaction: t, lock: t.LOCK.UPDATE });
        if (!st) throw new Error('Stock not found for part');

        const newQty = type === 'IN' ? st.qty + qty : st.qty - qty;
        if (newQty < 0) throw new Error('Insufficient stock');

        // Cập nhật lại số lượng stock
        await st.update({ qty: newQty }, { transaction: t });

        // Ghi lại entry vào bảng stock_entries
        await stock_entries.create({ part_id, qty, type, ref, created_by: user_id }, { transaction: t });
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
