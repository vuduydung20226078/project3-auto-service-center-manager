const paymentOrchestrator = require('../orchestrators/payment.orchestrator');

// Handler for VNPAY IPN (server-to-server callback)
// ✅ Update DB here
exports.handleVnpayIPN = async (req, res) => {
    try {
        const params = req.query || {};
        console.log('⚡ VNPAY IPN received (server callback):', params.vnp_TxnRef);

        // Process and update DB
        const result = await paymentOrchestrator.processVnPayReturn(params);

        console.log('✅ IPN processed successfully');
        // VNPay expects 200 OK on successful receipt
        return res.status(200).send('OK');
    } catch (error) {
        console.error('❌ Error processing VNPAY IPN:', error);
        return res.status(500).send('ERROR');
    }
};

// Handler for VNPay return (user redirected back from VNPAY)
// NO DB update - only verify and redirect to frontend
exports.handleVnpayReturn = async (req, res) => {
    try {
        const params = req.query || {};
        console.log('🔄 VNPAY return GET received (user redirect):', params.vnp_TxnRef);

        // Only verify, DO NOT update DB
        const verified = paymentOrchestrator.verifyVnPayReturn(params);
        console.log('✅ Verification result:', verified.isSuccess ? 'SUCCESS' : 'FAILED');

        // Redirect to frontend with all params
        const frontendUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/result';
        const redirectUrl = new URL(frontendUrl);

        // Copy all VNPay params for frontend to use
        Object.keys(params).forEach(k => {
            redirectUrl.searchParams.set(k, params[k]);
        });

        console.log('🔀 Redirecting to frontend:', redirectUrl.pathname);
        return res.redirect(redirectUrl.toString());
    } catch (error) {
        console.error('❌ Error verifying VNPAY return:', error);
        // Still redirect to frontend even on error, let frontend show error UI
        const frontendUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/result';
        return res.redirect(`${frontendUrl}?error=true&message=${encodeURIComponent(error.message)}`);
    }
};

// Handler for VNPay return forwarded from frontend (POST)
// Update DB here (idempotent)
exports.handleVnpayReturnPost = async (req, res) => {
    try {
        const params = req.body || req.query || {};
        console.log('📮 VNPAY return POST received (frontend forward):', params.vnp_TxnRef);

        // Process and update DB
        const result = await paymentOrchestrator.processVnPayReturn(params);

        console.log('✅ Payment processed:', result.payment.status);
        return res.json({
            success: true,
            status: result.payment.status,
            invoiceStatus: result.invoice ? result.invoice.status : null,
            payment: result.payment,
            invoice: result.invoice
        });
    } catch (error) {
        console.error('❌ Error processing VNPAY return POST:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
