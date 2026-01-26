const { Invoice, Payment, WorkOrder, Vehicle, Customer, WorkOrderItem, ServicesCatalog, PartsCatalog, User, sequelize } = require('../models');

// Lấy danh sách work orders đã hoàn thành (chưa có invoice)
exports.getCompletedWorkOrders = async () => {
    const completedWorkOrders = await WorkOrder.findAll({
        where: {
            status: 'COMPLETED'
        },
        include: [
            {
                model: Vehicle,
                attributes: ['id', 'license_plate', 'model', 'year'],
                include: [
                    {
                        model: Customer,
                        attributes: ['id', 'name', 'phone', 'email', 'address']
                    }
                ]
            },
            {
                model: Invoice,
                attributes: ['id'],
                required: false
            }
        ],
        order: [['updated_at', 'DESC']]
    });

    // Lọc những work orders chưa có invoice
    return completedWorkOrders.filter(wo => !wo.Invoice);
};

// Lấy chi tiết work order để tạo invoice
exports.getWorkOrderForInvoice = async (workOrderId) => {
    const workOrder = await WorkOrder.findByPk(workOrderId, {
        include: [
            {
                model: Vehicle,
                include: [
                    {
                        model: Customer,
                        attributes: ['id', 'name', 'phone', 'email', 'address']
                    }
                ]
            },
            {
                model: WorkOrderItem,
                attributes: ['id', 'item_type', 'item_id', 'description', 'quantity', 'unit_price', 'line_total']
            }
        ]
    });

    if (!workOrder) {
        throw new Error('Work order not found');
    }

    // Lấy thông tin chi tiết của services và parts
    const itemsWithDetails = await Promise.all(
        workOrder.WorkOrderItems.map(async (item) => {
            let itemDetails = null;
            if (item.item_type === 'SERVICE') {
                itemDetails = await ServicesCatalog.findByPk(item.item_id, {
                    attributes: ['id', 'name', 'price', 'estimated_duration']
                });
            } else if (item.item_type === 'PART') {
                itemDetails = await PartsCatalog.findByPk(item.item_id, {
                    attributes: ['id', 'name', 'price']
                });
            }
            return {
                ...item.toJSON(),
                details: itemDetails
            };
        })
    );

    return {
        ...workOrder.toJSON(),
        WorkOrderItems: itemsWithDetails
    };
};

// Lấy danh sách tất cả hóa đơn
exports.getAllInvoices = async ({ status, search, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
        where.status = status;
    }

    let invoices = await Invoice.findAndCountAll({
        where,
        attributes: ['id', 'work_order_id', 'invoice_no', 'amount_due', 'status', 'created_by', 'created_at', 'updated_at'],
        include: [
            {
                model: WorkOrder,
                attributes: ['id', 'status', 'total_amount'],
                include: [
                    {
                        model: Vehicle,
                        attributes: ['id', 'license_plate', 'model', 'year']
                    }
                ]
            },
            {
                model: User,
                as: 'Creator',
                attributes: ['id', 'username', 'full_name']
            }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
    });

    // Filter by search if provided
    if (search) {
        invoices.rows = invoices.rows.filter(invoice => {
            const invoiceNo = invoice.invoice_no?.toLowerCase() || '';
            const licensePlate = invoice.WorkOrder?.Vehicle?.license_plate?.toLowerCase() || '';
            const searchLower = search.toLowerCase();
            return invoiceNo.includes(searchLower) || licensePlate.includes(searchLower);
        });
        invoices.count = invoices.rows.length;
    }

    return {
        data: invoices.rows,
        pagination: {
            total: invoices.count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(invoices.count / limit)
        }
    };
};

// Tạo hóa đơn từ work order
exports.createInvoice = async ({ work_order_id, invoice_no, amount_due, created_by }) => {
    const wo = await WorkOrder.findByPk(work_order_id);
    if (!wo) throw new Error('Work Order not found');

    return await Invoice.create({
        work_order_id,
        invoice_no,
        amount_due: amount_due || wo.total_amount,
        status: 'UNPAID',
        created_by
    });
};

// Lấy hóa đơn theo ID
exports.getInvoice = async (id) => {
    return await Invoice.findByPk(id, {
        include: [
            {
                model: WorkOrder,
                include: [
                    {
                        model: Vehicle,
                        include: [{ model: Customer }]
                    }
                ]
            },
            {
                model: User,
                as: 'Creator',
                attributes: ['id', 'username', 'full_name']
            }
        ]
    });
};

// Cập nhật hóa đơn
exports.updateInvoice = async (id, updateData) => {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    return await invoice.update(updateData);
};

// Xóa hóa đơn
exports.deleteInvoice = async (id) => {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    await invoice.destroy();
    return { success: true, message: 'Invoice deleted successfully' };
};

// Cập nhật trạng thái hóa đơn
exports.updateInvoiceStatus = async (id, status) => {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    return await invoice.update({ status });
};

// Lấy thống kê hóa đơn
exports.getInvoiceStats = async () => {
    const totalInvoices = await Invoice.count();
    const paidInvoices = await Invoice.count({ where: { status: 'PAID' } });
    const unpaidInvoices = await Invoice.count({ where: { status: 'UNPAID' } });

    const totalRevenueResult = await Invoice.sum('amount_due', {
        where: { status: 'PAID' }
    });

    return {
        totalInvoices,
        paidInvoices,
        unpaidInvoices,
        totalRevenue: totalRevenueResult || 0
    };
};

// Lấy danh sách thanh toán của hóa đơn
exports.getInvoicePayments = async (invoiceId) => {
    return await Payment.findAll({
        where: { invoice_id: invoiceId },
        order: [['payment_date', 'DESC']]
    });
};

// Thêm thanh toán vào hóa đơn
exports.addPayment = async (id, { amount, method, user_id }) => {
    await sequelize.transaction(async (t) => {
        await Payment.create({ invoice_id: id, amount, method, received_by: user_id }, { transaction: t });

        // Tính tổng số tiền đã thanh toán
        const [sum] = await sequelize.query(
            `SELECT COALESCE(SUM(amount), 0) AS paid FROM payments WHERE invoice_id = :id`,
            { replacements: { id }, transaction: t, type: sequelize.QueryTypes.SELECT }
        );

        // Cập nhật trạng thái hóa đơn
        const inv = await Invoice.findByPk(id, { transaction: t });
        const status = Number(sum.paid) >= Number(inv.amount_due) ? 'PAID' :
            (Number(sum.paid) > 0 ? 'PARTIALLY_PAID' : 'UNPAID');
        await inv.update({ status }, { transaction: t });
    });
};
