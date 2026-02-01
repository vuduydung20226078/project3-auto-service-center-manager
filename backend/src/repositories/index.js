/**
 * Repository Index
 * Central export for all repositories
 */
module.exports = {
    bookingsRepo: require('./bookings.repo'),
    vehiclesRepo: require('./vehicles.repo'),
    customersRepo: require('./customers.repo'),
    usersRepo: require('./users.repo'),
    workOrdersRepo: require('./workOrders.repo'),
    stocksRepo: require('./stocks.repo'),
    catalogsRepo: require('./catalogs.repo'),
    techniciansRepo: require('./technicians.repo'),
    paymentsRepo: require('./payments.repo'),
    dashboardRepo: require('./dashboard.repo')
};
