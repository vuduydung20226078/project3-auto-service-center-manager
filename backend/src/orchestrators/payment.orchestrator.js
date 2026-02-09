const { paymentsRepo } = require('../repositories');
const { paymentService } = require('../services');

/**
 * Payment Orchestrator
 * Coordinates payment workflows across multiple steps
 * NO business logic - only orchestration
 */
class PaymentOrchestrator {
    /**
     * Initialize VNPay payment URL for customer redirect
     * Workflow: Build URL → Return to controller
     */
    async initializeVnPayPayment({ invoiceNo, amount, orderInfo, ipAddr }) {
        // Delegate to service (business logic)
        return paymentService.buildVnPayUrl({ invoiceNo, amount, orderInfo, ipAddr });
    }

    /**
     * Verify VNPay return signature
     * Workflow: Delegate verification to service
     */
    verifyVnPayReturn(params) {
        // Delegate to service (business logic)
        return paymentService.verifyVnPayReturn(params);
    }

    /**
     * Process VNPay IPN/Return callback (idempotent)
     * Workflow coordination: Verify → Find invoice → Create/Find payment → Update invoice
     */
    async processVnPayReturn(params, transaction = null) {
        console.log('Processing VNPAY return - orchestrator workflow:', params);

        // Step 1: Verify signature (service)
        const verified = paymentService.verifyVnPayReturn(params);
        if (!verified.isValid) {
            throw new Error('Invalid payment signature');
        }

        const vnp_ResponseCode = params.vnp_ResponseCode;
        const vnp_TxnRef = verified.vnp_TxnRef;
        const vnp_TransactionNo = verified.vnp_TransactionNo;

        // Step 2: Find invoice (repository)
        let invoice = null;
        if (vnp_TxnRef) {
            invoice = await paymentsRepo.findInvoiceByInvoiceNo(vnp_TxnRef, transaction);
        }

        // Step 3: Check if payment already exists (repository - idempotent check)
        let payment = null;
        if (vnp_TransactionNo) {
            payment = await paymentsRepo.findPaymentByTransactionRef(vnp_TransactionNo, transaction);
        }

        // Step 4: Create payment if not exists (service + repository)
        if (!payment) {
            const paymentData = paymentService.prepareVnPayPaymentData(params, invoice);
            payment = await paymentsRepo.createPayment(paymentData, transaction);
            console.log('Payment created:', payment.id);
        } else {
            console.log('Payment already exists (idempotent):', payment.id);
        }

        // Step 5: Update invoice status if payment successful (repository)
        if (invoice && vnp_ResponseCode === '00') {
            await paymentsRepo.updateInvoiceStatus(invoice.id, 'PAID', transaction);
            console.log('Invoice marked as PAID:', invoice.id);
        }

        return { payment, invoice };
    }

    /**
     * Process Cash payment
     * Workflow coordination: Validate → Find invoice → Create payment → Update invoice
     */
    async processCashPayment({ invoice_id, amount, received_by }, transaction = null) {
        // Step 1: Find invoice (repository)
        const invoice = await paymentsRepo.findInvoiceById(invoice_id, transaction);

        // Step 2: Validate invoice (service)
        paymentService.validateInvoiceForPayment(invoice);

        // Step 3: Prepare payment data (service)
        const paymentData = paymentService.prepareCashPaymentData({ invoice_id, amount, received_by });

        // Step 4: Create payment (repository)
        const payment = await paymentsRepo.createPayment(paymentData, transaction);

        // Step 5: Update invoice status (repository)
        await paymentsRepo.updateInvoiceStatus(invoice_id, 'PAID', transaction);

        return { payment, invoice };
    }

    /**
     * Process MoMo payment (similar flow to VNPay)
     * TODO: Implement MoMo specific logic
     */
    async processMoMoPayment({ invoiceNo, amount }, transaction = null) {
        throw new Error('MoMo payment not implemented yet');
    }
}

module.exports = new PaymentOrchestrator();
