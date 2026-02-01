// Helper functions for Work Order Management

export const calculateTotal = (services, parts) => {
    // Services always have quantity = 1, just sum their prices
    const servicesTotal = services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    // Parts have quantity, multiply price * quantity
    const partsTotal = parts.reduce((sum, p) => sum + ((parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0)), 0);
    return servicesTotal + partsTotal;
};

export const validateWorkOrderForm = (customerType, vehicleType, formData, newCustomer, newVehicle) => {
    const errors = {};

    if (customerType === 'new') {
        if (!newCustomer.name) errors.name = 'Customer name is required';
        if (!newCustomer.phone) errors.phone = 'Phone is required';
    } else {
        if (!formData.customer_id) errors.customer_id = 'Please select a customer';
    }

    if (vehicleType === 'new') {
        if (!newVehicle.license_plate) errors.license_plate = 'License plate is required';
        if (!newVehicle.model) errors.model = 'Model is required';
    } else {
        if (!formData.vehicle_id) errors.vehicle_id = 'Please select a vehicle';
    }

    return errors;
};

export const prepareWorkOrderData = (formData, customerId, vehicleId, services, parts) => {
    return {
        customer_id: customerId,
        vehicle_id: vehicleId,
        advisor_id: formData.advisor_id || null,
        priority: formData.priority,
        status: formData.status,
        services: services.map(s => ({
            service_id: s.service_id,
            quantity: s.quantity,
            price: s.price
        })),
        parts: parts.map(p => ({
            part_id: p.part_id,
            quantity: p.quantity,
            price: p.price
        }))
    };
};
