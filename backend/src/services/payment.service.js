const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

/**
 * Payment Service
 * Handles payment business logic: validation, calculation, verification
 */
class PaymentService {
    /**
     * Build VNPay payment URL
     * Business logic: URL construction, expiration time calculation
     */
    buildVnPayUrl({ invoiceNo, amount, orderInfo, ipAddr }) {
        // Validation
        if (!invoiceNo || !amount) {
            throw new Error('invoiceNo and amount are required');
        }

        const vnpay = new VNPay({
            tmnCode: process.env.VNPAY_TMN_CODE,
            secureSecret: process.env.VNPAY_HASH_SECRET,
            vnpayHost: process.env.VNPAY_URL,
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Business logic: Calculate expiration time
        const expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 15);

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr || '127.0.0.1',
            vnp_OrderInfo: orderInfo || `Payment for invoice ${invoiceNo}`,
            vnp_TxnRef: invoiceNo,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/result',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date(), 'yyyyMMddHHmmss'),
            vnp_ExpireDate: dateFormat(expireDate, 'yyyyMMddHHmmss'),
        });

        return { paymentUrl, expiresAt: expireDate.toISOString() };
    }

    /**
     * Verify VNPay return signature
     * Business logic: signature verification, response code validation
     */
    verifyVnPayReturn(params) {
        const vnp_ResponseCode = params.vnp_ResponseCode;
        const vnp_TxnRef = params.vnp_TxnRef || params.vnp_OrderInfo || null;
        const vnp_TransactionNo = params.vnp_TransactionNo || null;
        const vnp_SecureHash = params.vnp_SecureHash;
        const vnp_TransactionStatus = params.vnp_TransactionStatus;

        // TODO: Verify vnp_SecureHash signature (important for production)
        // const vnpay = new VNPay({ tmnCode, secureSecret, ... });
        // const isValid = vnpay.verifyReturnUrl(params);
        // if (!isValid) throw new Error('Invalid signature');

        // Business logic: Determine success based on response codes
        const isSuccess = vnp_ResponseCode === '00' && vnp_TransactionStatus === '00';

        return {
            isValid: true, // TODO: check signature
            isSuccess,
            vnp_ResponseCode,
            vnp_TxnRef,
            vnp_TransactionNo,
            params
        };
    }

    /**
     * Prepare payment data from VNPay response
     * Business logic: data transformation, amount calculation
     */
    prepareVnPayPaymentData(params, invoice) {
        const vnp_ResponseCode = params.vnp_ResponseCode;
        const vnp_TxnRef = params.vnp_TxnRef || params.vnp_OrderInfo || null;
        const vnp_TransactionNo = params.vnp_TransactionNo || null;
        const vnp_Amount = params.vnp_Amount || null;

        return {
            invoice_id: invoice ? invoice.id : null,
            amount: invoice ? invoice.amount_due : (vnp_Amount ? parseFloat(vnp_Amount) / 100 : 0),
            method: 'VNPAY',
            status: vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED',
            transaction_ref: vnp_TransactionNo || vnp_TxnRef,
            raw_response: params,
            paid_at: vnp_ResponseCode === '00' ? new Date() : null,
            received_by: invoice ? invoice.created_by : null
        };
    }

    /**
     * Validate invoice for payment
     * Business logic: invoice state validation
     */
    validateInvoiceForPayment(invoice) {
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        if (invoice.status === 'PAID') {
            throw new Error('Invoice already paid');
        }

        return true;
    }

    /**
     * Prepare cash payment data
     * Business logic: data preparation, reference generation
     */
    prepareCashPaymentData({ invoice_id, amount, received_by }) {
        // Validation
        if (!invoice_id || !amount || !received_by) {
            throw new Error('invoice_id, amount, and received_by are required');
        }

        return {
            invoice_id,
            amount: parseFloat(amount),
            method: 'CASH',
            status: 'SUCCESS',
            transaction_ref: `CASH-${Date.now()}`,
            paid_at: new Date(),
            received_by
        };
    }
}

module.exports = new PaymentService();
