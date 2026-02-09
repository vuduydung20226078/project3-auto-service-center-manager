/**
 * Stock Orchestrator
 * Coordinates multi-step stock workflows with transactions
 * Orchestrates calls to services and repositories
 */
const { stocksRepo } = require('../repositories');
const stockService = require('../services/stock.service');

class StockOrchestrator {
    /**
     * Add stock entry (IN/OUT/ADJ)
     * Workflow: Validate → Create entry → Update stock quantities
     */
    async addStockEntry({
        part_id,
        qty,
        type,
        ref_type,
        location,
        target_location,
        user_id
    }, transaction = null) {
        const shouldManageTransaction = !transaction;
        let managedTransaction = transaction;

        try {
            if (shouldManageTransaction) {
                const { sequelize } = require('../models');
                managedTransaction = await sequelize.transaction();
            }

            // Step 1: Prepare entry data (service)
            const entryData = stockService.prepareStockEntryData({
                part_id,
                qty,
                type,
                ref_type,
                user_id
            });

            // Step 2: Create stock entry log (repository)
            await stocksRepo.createEntry(entryData, managedTransaction);

            // Step 3: Handle different entry types (service logic + repository actions)
            if (ref_type === 'ADJ') {
                // Adjustment: Transfer between locations
                await this.handleAdjustment({
                    part_id,
                    qty,
                    location,
                    target_location
                }, managedTransaction);
            } else if (type === 'IN') {
                // Incoming stock - require explicit location
                if (!location) {
                    throw new Error('Location is required for incoming stock');
                }
                await this.handleIncomingStock({
                    part_id,
                    qty,
                    location
                }, managedTransaction);
            } else if (type === 'OUT') {
                // Outgoing stock - require explicit location
                if (!location) {
                    throw new Error('Location is required for outgoing stock');
                }
                await this.handleOutgoingStock({
                    part_id,
                    qty,
                    location
                }, managedTransaction);
            }

            if (shouldManageTransaction) {
                await managedTransaction.commit();
            }

            // Return success message
            return stockService.generateSuccessMessage(ref_type, type, qty, location, target_location);
        } catch (error) {
            if (shouldManageTransaction && managedTransaction) {
                await managedTransaction.rollback();
            }
            throw error;
        }
    }

    /**
     * Handle stock adjustment (transfer between locations)
     * Sub-workflow: Decrease source → Increase target
     */
    async handleAdjustment({ part_id, qty, location, target_location }, transaction) {
        // Validate (service)
        stockService.validateAdjustmentData(location, target_location);

        // Step 1: Decrease from source location (repository)
        const sourceStock = await stocksRepo.findByPartAndLocation(part_id, location);
        if (sourceStock) {
            // Validate availability (service)
            await stockService.validateAvailability(sourceStock, qty);
            // Decrement (repository)
            await sourceStock.decrement('qty', { by: qty, transaction });
        } else {
            throw new Error(`Stock not found at location: ${location}`);
        }

        // Step 2: Increase to target location (repository)
        const targetStock = await stocksRepo.findByPartAndLocation(part_id, target_location);
        if (targetStock) {
            await targetStock.increment('qty', { by: qty, transaction });
        } else {
            // Create new stock at target location
            await stocksRepo.upsert({
                part_id,
                location: target_location,
                qty: qty
            }, transaction);
        }
    }

    /**
     * Handle incoming stock
     * Sub-workflow: Find or create → Increment quantity
     */
    async handleIncomingStock({ part_id, qty, location }, transaction) {
        const stock = await stocksRepo.findByPartAndLocation(part_id, location);
        if (stock) {
            await stock.increment('qty', { by: qty, transaction });
        } else {
            // Create new stock record
            await stocksRepo.upsert({
                part_id,
                location,
                qty: qty
            }, transaction);
        }
    }

    /**
     * Handle outgoing stock
     * Sub-workflow: Find stock → Validate → Decrement quantity
     */
    async handleOutgoingStock({ part_id, qty, location }, transaction) {
        const stock = await stocksRepo.findByPartAndLocation(part_id, location);
        if (!stock) {
            throw new Error(`Stock not found at location: ${location}`);
        }

        // Validate availability (service)
        await stockService.validateAvailability(stock, qty);

        // Decrement (repository)
        await stock.decrement('qty', { by: qty, transaction });
    }
}

module.exports = new StockOrchestrator();
