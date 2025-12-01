const billingService = require('../services/billingService');  // Import service

// Tạo hóa đơn từ work order
exports.createInvoice = async (req, res) => {
    const { work_order_id, invoice_no } = req.body;
    try {
        const invoice = await billingService.createInvoice({ work_order_id, invoice_no });
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy hóa đơn theo ID
exports.getInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await billingService.getInvoice(id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Thêm thanh toán vào hóa đơn
exports.addPayment = async (req, res) => {
    const { id } = req.params;
    const { amount, method } = req.body;
    try {
        await billingService.addPayment(id, { amount, method, user_id: req.user.id });
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
