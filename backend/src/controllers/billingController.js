const billingService = require('../services/billingService');

// Lấy danh sách work orders đã hoàn thành (chưa có invoice)
exports.getCompletedWorkOrders = async (req, res) => {
    try {
        const workOrders = await billingService.getCompletedWorkOrders();
        res.json(workOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy chi tiết work order để tạo invoice
exports.getWorkOrderForInvoice = async (req, res) => {
    try {
        const workOrder = await billingService.getWorkOrderForInvoice(req.params.id);
        res.json(workOrder);
    } catch (error) {
        if (error.message === 'Work order not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy danh sách tất cả hóa đơn
exports.getAllInvoices = async (req, res) => {
    try {
        const result = await billingService.getAllInvoices(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tạo hóa đơn từ work order
exports.createInvoice = async (req, res) => {
    try {
        const { work_order_id, invoice_no, amount_due } = req.body;
        const invoice = await billingService.createInvoice({
            work_order_id,
            invoice_no,
            amount_due,
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
        const invoice = await billingService.getInvoice(req.params.id);
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
        const invoice = await billingService.updateInvoice(req.params.id, req.body);
        res.json(invoice);
    } catch (error) {
        if (error.message === 'Invoice not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Xóa hóa đơn
exports.deleteInvoice = async (req, res) => {
    try {
        const result = await billingService.deleteInvoice(req.params.id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invoice not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cập nhật trạng thái hóa đơn
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const invoice = await billingService.updateInvoiceStatus(req.params.id, req.body.status);
        res.json(invoice);
    } catch (error) {
        if (error.message === 'Invoice not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy thống kê hóa đơn
exports.getInvoiceStats = async (req, res) => {
    try {
        const stats = await billingService.getInvoiceStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy danh sách thanh toán của hóa đơn
exports.getInvoicePayments = async (req, res) => {
    try {
        const payments = await billingService.getInvoicePayments(req.params.id);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm thanh toán vào hóa đơn
exports.addPayment = async (req, res) => {
    try {
        const { amount, method } = req.body;
        await billingService.addPayment(req.params.id, {
            amount,
            method,
            user_id: req.user.id
        });
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
