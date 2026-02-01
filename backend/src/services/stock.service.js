/**
 * Stock Service
 * Handles stock business logic: validation, availability checks
 */
class StockService {
    /**
     * Validate stock availability
     * Business logic: check if enough stock is available
     */
    async validateAvailability(stock, requestedQuantity) {
        if (!stock) {
            throw new Error('Stock not found');
        }

        const availableQty = stock.qty || 0;
        if (availableQty < requestedQuantity) {
            throw new Error(`Insufficient stock. Available: ${availableQty}, Requested: ${requestedQuantity}`);
        }

        return true;
    }

    /**
     * Check if stock is below reorder level (threshold: 10)
     * Business logic: reorder threshold check
     */
    isLowStock(stock) {
        if (!stock) return false;
        const qty = stock.qty || 0;
        return qty < 10; // Low stock threshold
    }

    /**
     * Calculate stock value
     * Business logic: value calculation
     */
    calculateStockValue(quantity, unitPrice) {
        return parseFloat(quantity) * parseFloat(unitPrice);
    }

    /**
     * Prepare stock entry data
     * Business logic: entry data formatting
     */
    prepareStockEntry({ partId, quantity, entryType, refType, notes, userId }) {
        return {
            part_id: partId,
            qty: entryType === 'IN' ? quantity : -quantity,
            type: entryType,
            ref_type: refType,
            notes,
            created_by: userId
        };
    }
}

module.exports = new StockService();
