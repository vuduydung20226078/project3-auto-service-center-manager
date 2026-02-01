const paymentOrchestrator = require('../orchestrators/payment.orchestrator');
const { Op } = require('sequelize');

// Initialize VNPay instance
exports.initializeVnPay = async (req, res) => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Body type:', typeof req.body);

        // Check if req.body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request body is required or empty'
            });
        }

        const { invoiceNo, amount, orderInfo, ipAddr } = req.body;

        // Validate required fields
        if (!amount || !invoiceNo) {
            return res.status(400).json({
                success: false,
                message: 'Invoice number and amount are required'
            });
        }

        const { paymentUrl, expiresAt } = await paymentOrchestrator.initializeVnPayPayment({
            invoiceNo,
            amount,
            orderInfo,
            ipAddr
        });
        return res.status(201).json({ success: true, paymentUrl, expiresAt });
    } catch (error) {
        console.error('Error creating payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment',
            error: error.message
        });
    }
}
