'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        customer_id: { type: DataTypes.INTEGER, allowNull: false },
        vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
        scheduled_at: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'), defaultValue: 'PENDING' },
        notes: { type: DataTypes.TEXT }
    }, {
        tableName: 'bookings',
        underscored: true,
        timestamps: true
    });

    Booking.associate = models => {
        Booking.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Booking.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' });
        Booking.hasOne(models.WorkOrder, { foreignKey: 'booking_id' });
    };

    return Booking;
};
