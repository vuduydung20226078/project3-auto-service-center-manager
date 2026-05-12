/**
 * Payments and Invoices Repository
 * Isolates Sequelize queries from service layer
 */
const { Payment, Invoice, WorkOrder, Vehicle } = require('../models');

class PaymentsRepository {
    // ========== Payments ==========

    /**
     * Create a new payment
     */
    async createPayment(data, transaction = null) {
        return await Payment.create(data, { transaction });
    }

    /**
     * Find payment by ID
     */
    async findPaymentById(id) {
        return await Payment.findByPk(id, {
            include: [
                {
                    model: Invoice,
                    include: [
                        {
                            model: WorkOrder,
                            attributes: ['id', 'status']
                        }
                    ]
                }
            ]
        });
    }

    /**
     * Find payment by transaction ID (for VNPAY, MoMo)
     */
    async findPaymentByTransactionId(transactionId) {
        return await Payment.findOne({
            where: { transaction_id: transactionId }
        });
    }

    /**
     * Find payment by transaction reference (for VNPAY, MoMo)
     */
    async findPaymentByTransactionRef(transactionRef, transaction = null) {
        return await Payment.findOne({
            where: { transaction_ref: transactionRef },
            transaction
        });
    }

    /**
     * Update payment
     */
    async updatePayment(id, data, transaction = null) {
        const payment = await Payment.findByPk(id);
        if (!payment) return null;

        await payment.update(data, { transaction });
        return payment;
    }

    /**
     * Update payment status
     */
    async updatePaymentStatus(id, status, transaction = null) {
        const payment = await Payment.findByPk(id);
        if (!payment) return null;

        await payment.update({ status }, { transaction });
        return payment;
    }

    // ========== Invoices ==========

    /**
     * Create a new invoice
     */
    async createInvoice(data, transaction = null) {
        return await Invoice.create(data, { transaction });
    }

    /**
     * Find invoice by ID
     */
    async findInvoiceById(id) {
        return await Invoice.findByPk(id, {
            include: [
                {
                    model: WorkOrder,
                    attributes: ['id', 'status', 'vehicle_id', 'technician_id']
                }
            ]
        });
    }

    /**
     * Find invoice by work order ID
     */
    async findInvoiceByWorkOrderId(workOrderId) {
        return await Invoice.findOne({
            where: { work_order_id: workOrderId }
        });
    }

    /**
     * Find invoice by invoice number
     */
    async findInvoiceByInvoiceNo(invoiceNo, transaction = null) {
        return await Invoice.findOne({
            where: { invoice_no: invoiceNo },
            transaction
        });
    }

    /**
     * Update invoice
     */
    async updateInvoice(id, data, transaction = null) {
        const invoice = await Invoice.findByPk(id);
        if (!invoice) return null;

        await invoice.update(data, { transaction });
        return invoice;
    }

    /**
     * Update invoice status
     */
    async updateInvoiceStatus(id, status, transaction = null) {
        const invoice = await Invoice.findByPk(id);
        if (!invoice) return null;

        await invoice.update({ status }, { transaction });
        return invoice;
    }

    /**
     * Delete invoice
     */
    async deleteInvoice(id, transaction = null) {
        const invoice = await Invoice.findByPk(id);
        if (!invoice) return null;

        await invoice.destroy({ transaction });
        return invoice;
    }

    /**
     * Find all invoices
     */
    async findAllInvoices({ status, from, to } = {}) {
        const where = {};

        if (status) where.status = status;
        if (from || to) {
            where.created_at = {};
            if (from) where.created_at[Op.gte] = new Date(from);
            if (to) where.created_at[Op.lte] = new Date(to);
        }

        return await Invoice.findAll({
            where,
            include: [
                {
                    model: WorkOrder,
                    attributes: ['id', 'status', 'vehicle_id'],
                    include: [
                        {
                            model: Vehicle,
                            attributes: ['id', 'license_plate']
                        }
                    ],
                }
                
            ],
            order: [['created_at', 'DESC']]
        });
    }
}

const { Op } = require('sequelize');
module.exports = new PaymentsRepository();
