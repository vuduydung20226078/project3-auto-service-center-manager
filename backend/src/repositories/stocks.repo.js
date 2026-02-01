/**
 * Stocks Repository
 * Isolates Sequelize queries from service layer
 */
const { Stock, StockEntry, Part } = require('../models');
const { Op } = require('sequelize');

class StocksRepository {
    /**
     * Find stock by part ID
     */
    async findByPartId(partId) {
        return await Stock.findOne({
            where: { part_id: partId },
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'unit_price', 'sku']
                }
            ]
        });
    }

    /**
     * Find all stocks
     */
    async findAll({ low_stock_only } = {}) {
        const where = {};

        if (low_stock_only) {
            where.qty = { [Op.lt]: 10 }; // Low stock threshold
        }

        return await Stock.findAll({
            where,
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'unit_price', 'sku']
                }
            ],
            order: [['part_id', 'ASC']]
        });
    }

    /**
     * Find low stock items
     */
    async findLowStock(limit = 10) {
        return await Stock.findAll({
            where: {
                qty: { [Op.lt]: 10 }
            },
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'unit_price', 'sku']
                }
            ],
            order: [['qty', 'ASC']],
            limit
        });
    }

    /**
     * Create or update stock
     */
    async upsert(data, transaction = null) {
        const [stock, created] = await Stock.findOrCreate({
            where: { part_id: data.part_id },
            defaults: data,
            transaction
        });

        if (!created) {
            await stock.update(data, { transaction });
        }

        return stock;
    }

    /**
     * Update stock quantity
     */
    async updateQuantity(partId, quantity, transaction = null) {
        const stock = await Stock.findOne({ where: { part_id: partId } });
        if (!stock) return null;

        await stock.update({ qty: quantity }, { transaction });
        return stock;
    }

    /**
     * Increment stock quantity
     * Pure data operation - validation should be done by orchestrator/service
     */
    async incrementQuantity(partId, amount, notes = null, userId = null, transaction = null) {
        const stock = await Stock.findOne({ where: { part_id: partId }, transaction });
        if (!stock) {
            return null; // Let caller handle not found
        }

        await stock.increment('qty', { by: amount, transaction });

        // Create stock entry
        if (notes || userId) {
            await this.createEntry({
                part_id: partId,
                quantity_change: amount,
                entry_type: 'IN',
                ref_type: 'MANUAL',
                notes,
                performed_by: userId
            }, transaction);
        }

        return stock;
    }

    /**
     * Decrement stock quantity
     * Pure data operation - validation should be done by orchestrator/service
     */
    async decrementQuantity(partId, amount, notes = null, userId = null, transaction = null) {
        const stock = await Stock.findOne({ where: { part_id: partId }, transaction });
        if (!stock) {
            return null; // Let caller handle not found
        }

        // NO business logic validation here - orchestrator/service should validate before calling
        await stock.decrement('qty', { by: amount, transaction });

        // Create stock entry
        if (notes || userId) {
            await this.createEntry({
                part_id: partId,
                quantity_change: -amount,
                entry_type: 'OUT',
                ref_type: 'WORK_ORDER',
                notes,
                performed_by: userId
            }, transaction);
        }

        return stock;
    }

    /**
     * Delete stock
     */
    async delete(partId, location, transaction = null) {
        const stock = await Stock.findOne({
            where: { part_id: partId, location },
            transaction
        });
        if (!stock) return null;

        await stock.destroy({ transaction });
        return stock;
    }

    /**
     * Create stock entry (transaction log)
     */
    async createEntry(data, transaction = null) {
        return await StockEntry.create(data, { transaction });
    }

    /**
     * Find stock entries by part ID
     */
    async findEntriesByPartId(partId, { limit = 50 } = {}) {
        return await StockEntry.findAll({
            where: { part_id: partId },
            order: [['entry_date', 'DESC']],
            limit
        });
    }

    /**
     * Find all stock entries
     */
    async findAllEntries({ from, to, type } = {}) {
        const where = {};

        if (from || to) {
            where.entry_date = {};
            if (from) where.entry_date[Op.gte] = new Date(from);
            if (to) where.entry_date[Op.lte] = new Date(to);
        }

        if (type) {
            where.type = type;
        }

        return await StockEntry.findAll({
            where,
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'sku']
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
}

const { sequelize } = require('../models');
module.exports = new StocksRepository();
