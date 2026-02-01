const { workOrdersRepo, stocksRepo, techniciansRepo, bookingsRepo } = require('../repositories');
const { workOrderService, stockService } = require('../services');

/**
 * Work Order Orchestrator
 * Coordinates work order workflows across multiple entities
 * NO business logic - only orchestration
 */
class WorkOrderOrchestrator {
    /**
     * Create work order with items (multi-step transaction)
     * Workflow: Validate → Calculate → Create WO → Create items → Update stock → Assign technician
     */
    async createWorkOrderWithItems({
        booking_id = null,
        vehicle_id,
        technician_id,
        status = 'OPEN',
        items = [],
        user_id,
        start_time = null,
        end_time = null,
        estimated_duration = 90
    }, transaction = null) {
        const shouldManageTransaction = !transaction;
        let managedTransaction = transaction;

        try {
            if (shouldManageTransaction) {
                const { sequelize } = require('../models');
                managedTransaction = await sequelize.transaction();
            }

            // Step 1: Validate items (service)
            if (items.length > 0) {
                workOrderService.validateItems(items);
            }

            // Step 2: Calculate total amount (service)
            const total_amount = workOrderService.calculateTotalAmount(items);

            // Step 3: Prepare work order data (service)
            const workOrderData = workOrderService.prepareWorkOrderData({
                booking_id,
                vehicle_id,
                technician_id,
                status,
                total_amount,
                start_time,
                end_time,
                estimated_duration,
                user_id
            });

            // Step 4: Create work order (repository)
            const workOrder = await workOrdersRepo.create(workOrderData, managedTransaction);

            // Step 5: Create work order items and update stock (loop workflow)
            for (const item of items) {
                // Prepare item data (service)
                const itemData = workOrderService.prepareItemData(item, workOrder.id);

                // Create item (repository)
                await workOrdersRepo.createItem(itemData, managedTransaction);

                // Decrease stock for parts (service check + validation + repository action)
                if (workOrderService.shouldDecrementStock(item.item_type)) {
                    // Validate stock availability (service)
                    const stock = await stocksRepo.findByPartId(item.item_id, managedTransaction);
                    await stockService.validateAvailability(stock, item.quantity || 1);

                    // Decrement quantity (repository)
                    await stocksRepo.decrementQuantity(
                        item.item_id,
                        item.quantity || 1,
                        `Used in Work Order #${workOrder.id}`,
                        user_id,
                        managedTransaction
                    );
                }
            }

            // Step 6: Update technician availability (repository)
            if (technician_id) {
                await techniciansRepo.updateAvailability(technician_id, false, managedTransaction);
            }

            if (shouldManageTransaction) {
                await managedTransaction.commit();
            }

            // Return with associations
            return await workOrdersRepo.findById(workOrder.id);
        } catch (error) {
            if (shouldManageTransaction && managedTransaction) {
                await managedTransaction.rollback();
            }
            throw error;
        }
    }

    /**
     * Create work order from booking
     * Workflow: Create WO with items → Update booking status
     */
    async createWorkOrderFromBooking({
        booking_id,
        vehicle_id,
        technician_id,
        items = [],
        user_id,
        start_time = null,
        estimated_duration = 90
    }, transaction = null) {
        const shouldManageTransaction = !transaction;
        let managedTransaction = transaction;

        try {
            if (shouldManageTransaction) {
                const { sequelize } = require('../models');
                managedTransaction = await sequelize.transaction();
            }

            // Step 1: Create work order with items (sub-workflow)
            const workOrder = await this.createWorkOrderWithItems({
                booking_id,
                vehicle_id,
                technician_id,
                status: 'OPEN',
                items,
                user_id,
                start_time,
                estimated_duration
            }, managedTransaction);

            // Step 2: Update booking status (repository)
            await bookingsRepo.updateStatus(
                booking_id,
                'CONFIRMED',
                managedTransaction
            );

            if (shouldManageTransaction) {
                await managedTransaction.commit();
            }

            return workOrder;
        } catch (error) {
            if (shouldManageTransaction && managedTransaction) {
                await managedTransaction.rollback();
            }
            throw error;
        }
    }

    /**
     * Add item to existing work order
     * Workflow: Validate → Prepare → Create item → Update total → Update stock
     */
    async addItemToWorkOrder({
        work_order_id,
        item_type,
        item_id,
        quantity = 1,
        unit_price,
        description = null,
        user_id
    }, transaction = null) {
        const shouldManageTransaction = !transaction;
        let managedTransaction = transaction;

        try {
            if (shouldManageTransaction) {
                const { sequelize } = require('../models');
                managedTransaction = await sequelize.transaction();
            }

            // Step 1: Validate item (service)
            workOrderService.validateItems([{ item_type, item_id, quantity, unit_price }]);

            // Step 2: Prepare item data (service)
            const itemData = workOrderService.prepareItemData(
                { item_type, item_id, quantity, unit_price, description },
                work_order_id
            );

            // Step 3: Create item (repository)
            const item = await workOrdersRepo.createItem(itemData, managedTransaction);

            // Step 4: Update work order total amount (service + repository)
            const workOrder = await workOrdersRepo.findById(work_order_id, managedTransaction);
            const newTotal = workOrderService.calculateNewTotal(workOrder.total_amount, unit_price, quantity);
            await workOrdersRepo.updateTotalAmount(work_order_id, newTotal, managedTransaction);

            // Step 5: Validate and decrease stock for parts (service validation + repository action)
            if (workOrderService.shouldDecrementStock(item_type)) {
                // Validate stock availability (service)
                const stock = await stocksRepo.findByPartId(item_id, managedTransaction);
                await stockService.validateAvailability(stock, quantity);

                // Decrement quantity (repository)
                await stocksRepo.decrementQuantity(
                    item_id,
                    quantity,
                    `Added to Work Order #${work_order_id}`,
                    user_id,
                    managedTransaction
                );
            }

            if (shouldManageTransaction) {
                await managedTransaction.commit();
            }

            return item;
        } catch (error) {
            if (shouldManageTransaction && managedTransaction) {
                await managedTransaction.rollback();
            }
            throw error;
        }
    }

    /**
     * Assign technician to work order
     * Workflow: Get WO → Free old technician → Assign new → Mark new as unavailable
     */
    async assignTechnicianToWorkOrder(work_order_id, technician_id, transaction = null) {
        const shouldManageTransaction = !transaction;
        let managedTransaction = transaction;

        try {
            if (shouldManageTransaction) {
                const { sequelize } = require('../models');
                managedTransaction = await sequelize.transaction();
            }

            // Step 1: Get current work order (repository)
            const workOrder = await workOrdersRepo.findById(work_order_id, managedTransaction);
            if (!workOrder) {
                throw new Error('Work order not found');
            }

            // Step 2: Free up previous technician (repository)
            if (workOrder.technician_id && workOrder.technician_id !== technician_id) {
                await techniciansRepo.updateAvailability(workOrder.technician_id, true, managedTransaction);
            }

            // Step 3: Assign new technician (repository)
            await workOrdersRepo.updateTechnician(work_order_id, technician_id, managedTransaction);

            // NOTE: do NOT change technician availability when assigning here.
            // Availability is controlled when the work order status changes (OPEN -> IN_PROGRESS).

            if (shouldManageTransaction) {
                await managedTransaction.commit();
            }

            return await workOrdersRepo.findById(work_order_id);
        } catch (error) {
            if (shouldManageTransaction && managedTransaction) {
                await managedTransaction.rollback();
            }
            throw error;
        }
    }

    /**
     * Complete work order
     * Workflow: Get WO → Update status → Update end time → Free technician
     */
    async completeWorkOrder(work_order_id, end_time = null, transaction = null) {
        const shouldManageTransaction = !transaction;
        let managedTransaction = transaction;

        try {
            if (shouldManageTransaction) {
                const { sequelize } = require('../models');
                managedTransaction = await sequelize.transaction();
            }

            // Step 1: Get work order (repository)
            const workOrder = await workOrdersRepo.findById(work_order_id, managedTransaction);
            if (!workOrder) {
                throw new Error('Work order not found');
            }

            // Step 2: Update status to COMPLETED (repository)
            await workOrdersRepo.updateStatus(work_order_id, 'COMPLETED', managedTransaction);

            // Step 3: Update end time (repository)
            if (end_time) {
                await workOrdersRepo.updateEndTime(work_order_id, end_time, managedTransaction);
            }

            // Step 4: Free technician (repository)
            if (workOrder.technician_id) {
                await techniciansRepo.updateAvailability(workOrder.technician_id, true, managedTransaction);
            }

            if (shouldManageTransaction) {
                await managedTransaction.commit();
            }

            return await workOrdersRepo.findById(work_order_id);
        } catch (error) {
            if (shouldManageTransaction && managedTransaction) {
                await managedTransaction.rollback();
            }
            throw error;
        }
    }
}

module.exports = new WorkOrderOrchestrator();
