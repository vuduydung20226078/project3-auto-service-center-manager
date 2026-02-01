const { paymentsRepo, workOrdersRepo } = require('../repositories');
const paymentOrchestrator = require('../orchestrators/payment.orchestrator');

// Lấy danh sách work orders đã hoàn thành (chưa có invoice)
exports.getCompletedWorkOrders = async (req, res) => {
    try {
        const workOrders = await workOrdersRepo.findAll({ status: 'COMPLETED' });

        // Filter out work orders that already have invoices
        const workOrdersWithoutInvoice = [];
        for (const wo of workOrders) {
            const invoice = await paymentsRepo.findInvoiceByWorkOrderId(wo.id);
            if (!invoice) {
                workOrdersWithoutInvoice.push(wo);
            }
        }

        res.json(workOrdersWithoutInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết work order để tạo invoice
exports.getWorkOrderForInvoice = async (req, res) => {
    try {
        const workOrder = await workOrdersRepo.findById(req.params.id);
        if (!workOrder) {
            return res.status(404).json({ message: 'Work order not found' });
        }
        res.json(workOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy danh sách tất cả hóa đơn
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await paymentsRepo.findAllInvoices(req.query);
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo hóa đơn từ work order
exports.createInvoice = async (req, res) => {
    try {
        const { work_order_id, invoice_no, amount_due } = req.body;
        const invoice = await paymentsRepo.createInvoice({
            work_order_id,
            invoice_no,
            amount_due,
            status: 'UNPAID',
            created_by: req.user.id
        });
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy hóa đơn theo ID
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await paymentsRepo.findInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật hóa đơn
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await paymentsRepo.updateInvoice(req.params.id, req.body);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa hóa đơn
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await paymentsRepo.findInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        await paymentsRepo.deleteInvoice(req.params.id);
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật trạng thái hóa đơn
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const invoice = await paymentsRepo.updateInvoiceStatus(req.params.id, req.body.status);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy thống kê hóa đơn
exports.getInvoiceStats = async (req, res) => {
    try {
        const { sequelize } = require('../models');

        const [results] = await sequelize.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'UNPAID' THEN 1 END) as unpaid,
                COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid,
                COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled,
                COALESCE(SUM(amount_due), 0) as total_amount,
                COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount_due ELSE 0 END), 0) as paid_amount
            FROM invoices
        `);

        res.json(results[0] || {});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy danh sách thanh toán của hóa đơn
exports.getInvoicePayments = async (req, res) => {
    try {
        const { Payment } = require('../models');
        const payments = await Payment.findAll({
            where: { invoice_id: req.params.id },
            order: [['paid_at', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm thanh toán vào hóa đơn
exports.addPayment = async (req, res) => {
    try {
        const { amount, method } = req.body;
        const invoice_id = parseInt(req.params.id);

        // Use payment orchestrator for cash payments
        if (method === 'CASH') {
            await paymentOrchestrator.processCashPayment({
                invoice_id,
                amount,
                received_by: req.user.id
            });
        } else {
            // For other methods, create payment directly
            await paymentsRepo.createPayment({
                invoice_id,
                amount,
                method,
                status: 'SUCCESS',
                paid_at: new Date(),
                received_by: req.user.id
            });
            await paymentsRepo.updateInvoiceStatus(invoice_id, 'PAID');
        }

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
