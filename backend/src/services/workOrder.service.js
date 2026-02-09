/**
 * Work Order Service
 * Handles work order business logic: calculations, validations
 */
class WorkOrderService {
    /**
     * Calculate total amount from items
     * Business logic: price calculation
     */
    calculateTotalAmount(items) {
        if (!items || items.length === 0) {
            return 0;
        }

        return items.reduce((sum, item) => {
            const itemPrice = parseFloat(item.unit_price || 0);
            const itemQty = parseInt(item.quantity || 1, 10);
            return sum + (itemPrice * itemQty);
        }, 0);
    }

    /**
     * Validate work order items
     * Business logic: validation rules
     */
    validateItems(items) {
        if (!Array.isArray(items)) {
            throw new Error('Items must be an array');
        }

        for (const item of items) {
            if (!item.item_type || !item.item_id) {
                throw new Error('Each item must have item_type and item_id');
            }

            if (!['SERVICE', 'PART'].includes(item.item_type)) {
                throw new Error('item_type must be SERVICE or PART');
            }

            if (item.quantity && item.quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            if (item.unit_price && item.unit_price < 0) {
                throw new Error('Unit price cannot be negative');
            }
        }

        return true;
    }

    /**
     * Prepare work order data
     * Business logic: data preparation
     */
    prepareWorkOrderData({
        booking_id,
        vehicle_id,
        technician_id,
        status = 'OPEN',
        total_amount,
        start_time = null,
        end_time = null,
        estimated_duration = 90,
        user_id
    }) {
        return {
            booking_id,
            vehicle_id,
            technician_id,
            status,
            total_amount,
            start_time,
            end_time,
            estimated_duration,
            created_by: user_id
        };
    }

    /**
     * Prepare work order item data
     * Business logic: data transformation
     */
    prepareItemData(item, workOrderId) {
        const quantity = parseInt(item.quantity || 1, 10);
        const unitPrice = parseFloat(item.unit_price || 0);
        const lineTotal = quantity * unitPrice;

        return {
            work_order_id: workOrderId,
            item_type: item.item_type,
            item_id: item.item_id,
            quantity: quantity,
            unit_price: unitPrice,
            line_total: lineTotal,
            description: item.description || null
        };
    }

    /**
     * Determine if stock should be decremented
     * Business logic: stock management rule
     */
    shouldDecrementStock(itemType) {
        return itemType === 'PART';
    }

    /**
     * Calculate new total after adding item
     * Business logic: incremental calculation
     */
    calculateNewTotal(currentTotal, unitPrice, quantity) {
        return parseFloat(currentTotal || 0) + (parseFloat(unitPrice) * parseInt(quantity, 10));
    }
}

module.exports = new WorkOrderService();
