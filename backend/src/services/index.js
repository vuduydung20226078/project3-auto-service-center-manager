const paymentService = require('./payment.service');
const workOrderService = require('./workOrder.service');
const stockService = require('./stock.service');
const bookingService = require('./booking.service');
const dashboardService = require('./dashboard.service');
const techniciansService = require('./technicians.service');

module.exports = {
    paymentService,
    workOrderService,
    stockService,
    bookingService,
    dashboardService,
    techniciansService
};
