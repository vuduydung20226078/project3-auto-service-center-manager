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
    prepareStockEntryData({ part_id, qty, type, ref_type, user_id }) {
        return {
            part_id: parseInt(part_id),
            qty: parseInt(qty),
            type: type,
            ref_type: ref_type,
            created_by: user_id
        };
    }

    /**
     * Validate adjustment data
     * Business logic: check if adjustment has required fields
     */
    validateAdjustmentData(location, target_location) {
        if (!location || !target_location) {
            throw new Error('Adjustment requires both source location and target location');
        }
        if (location === target_location) {
            throw new Error('Source and target locations cannot be the same');
        }
        return true;
    }

    /**
     * Generate success message based on operation type
     * Business logic: user-facing message generation
     */
    generateSuccessMessage(ref_type, type, qty, location, target_location) {
        if (ref_type === 'ADJ') {
            return `Adjusted ${qty} items from ${location} to ${target_location}`;
        } else if (type === 'IN') {
            return `Added ${qty} items to stock`;
        } else if (type === 'OUT') {
            return `Removed ${qty} items from stock`;
        }
        return 'Stock entry created successfully';
    }
}

module.exports = new StockService();
