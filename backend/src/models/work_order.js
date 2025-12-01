'use strict';
module.exports = (sequelize, DataTypes) => {
    const WorkOrder = sequelize.define('WorkOrder', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        booking_id: { type: DataTypes.INTEGER },
        advisor_id: { type: DataTypes.INTEGER },
        vehicle_id: { type: DataTypes.INTEGER },
        status: { type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CLOSED'), defaultValue: 'OPEN' },
        total_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 }
    }, {
        tableName: 'work_orders',
        underscored: true,
        timestamps: true
    });

    WorkOrder.associate = models => {
        WorkOrder.belongsTo(models.Booking, { foreignKey: 'booking_id' });
        WorkOrder.belongsTo(models.User, { foreignKey: 'advisor_id' });
        WorkOrder.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' });
        WorkOrder.hasMany(models.WorkOrderItem, { foreignKey: 'work_order_id' });
        WorkOrder.hasMany(models.Assignment, { foreignKey: 'work_order_id' });
        WorkOrder.hasOne(models.Invoice, { foreignKey: 'work_order_id' });
    };

    return WorkOrder;
};
