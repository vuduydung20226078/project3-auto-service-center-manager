/**
 * Middleware to attach customer_id to req for Customer role users
 * This follows SRP: separation of user->customer mapping from controller logic
 */
const { Customer } = require('../models');

module.exports = async (req, res, next) => {
    try {
        // Only for Customer role
        if (req.user && req.user.role === 'Customer') {
            const customer = await Customer.findOne({
                where: { user_id: req.user.id },
                attributes: ['id']
            });

            if (!customer) {
                return res.status(404).json({
                    message: 'Customer profile not found. Please contact support.'
                });
            }

            // Attach to request for downstream use
            req.customerId = customer.id;
        }

        next();
    } catch (error) {
        console.error('Error in attachCustomer middleware:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
