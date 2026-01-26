'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        customer_id: { type: DataTypes.INTEGER, allowNull: false },
        vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
        scheduled_at: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'), defaultValue: 'PENDING' },
        notes: { type: DataTypes.TEXT },
        work_order_id: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        tableName: 'bookings',
        underscored: true,
        timestamps: true
    });

    Booking.associate = models => {
        Booking.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Booking.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' });
        Booking.hasOne(models.WorkOrder, { foreignKey: 'booking_id' });
        Booking.belongsTo(models.WorkOrder, { foreignKey: 'work_order_id', as: 'WorkOrderRef' });
    };

    return Booking;
};
