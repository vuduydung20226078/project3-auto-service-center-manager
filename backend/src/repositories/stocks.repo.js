/**
 * Stocks Repository
 * Isolates Sequelize queries from service layer
 */
const { Stock, StockEntry, Part } = require('../models');
const { Op } = require('sequelize');

class StocksRepository {
    /**
     * Find stock by part ID (first available location with qty > 0)
     */
    async findByPartId(partId, transaction = null) {
        return await Stock.findOne({
            where: {
                part_id: partId,
                qty: { [require('sequelize').Op.gt]: 0 }
            },
            order: [['qty', 'DESC']], // Get location with most quantity first
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'unit_price', 'sku', 'unit']
                }
            ],
            transaction
        });
    }

    /**
     * Find stock by part ID and location
     */
    async findByPartAndLocation(partId, location) {
        return await Stock.findOne({
            where: {
                part_id: partId,
                location: location || 'Default'
            },
            include: [
                {
                    model: Part,
                    attributes: ['id', 'name', 'unit_price', 'sku', 'unit']
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
                    attributes: ['id', 'name', 'unit_price', 'sku', 'unit']
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
                    attributes: ['id', 'name', 'unit_price', 'sku', 'unit']
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
            where: {
                part_id: data.part_id,
                location: data.location || 'Default'
            },
            defaults: data,
            transaction
        });

        if (!created && data.qty !== undefined) {
            // If stock exists and qty is provided, increment instead of replace
            await stock.increment('qty', { by: data.qty, transaction });
        }

        return stock;
    }

    /**
     * Update stock quantity
     */
    async updateQuantity(partId, quantity, transaction = null, location = 'Default') {
        const stock = await Stock.findOne({
            where: {
                part_id: partId,
                location: location
            }
        });
        if (!stock) return null;

        await stock.update({ qty: quantity }, { transaction });
        return stock;
    }

    /**
     * Increment stock quantity
     * Pure data operation - validation should be done by orchestrator/service
     */
    async incrementQuantity(partId, amount, notes = null, userId = null, transaction = null, location = 'Default') {
        const stock = await Stock.findOne({
            where: {
                part_id: partId,
                location: location
            },
            transaction
        });
        if (!stock) {
            return null; // Let caller handle not found
        }

        await stock.increment('qty', { by: amount, transaction });

        // Create stock entry
        if (notes || userId) {
            await this.createEntry({
                part_id: partId,
                qty: amount,
                type: 'IN',
                ref_type: 'MANUAL',
                created_by: userId
            }, transaction);
        }

        return stock;
    }

    /**
     * Decrement stock quantity
     * Pure data operation - validation should be done by orchestrator/service
     */
    async decrementQuantity(partId, amount, notes = null, userId = null, transaction = null, location = 'Default') {
        const stock = await Stock.findOne({
            where: {
                part_id: partId,
                location: location
            },
            transaction
        });
        if (!stock) {
            return null; // Let caller handle not found
        }

        // NO business logic validation here - orchestrator/service should validate before calling
        await stock.decrement('qty', { by: amount, transaction });

        // Create stock entry
        if (notes || userId) {
            await this.createEntry({
                part_id: partId,
                qty: amount,
                type: 'OUT',
                ref_type: 'WO',
                created_by: userId
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
