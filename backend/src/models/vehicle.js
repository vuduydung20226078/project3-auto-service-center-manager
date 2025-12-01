'use strict';
module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('Vehicle', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        customer_id: { type: DataTypes.INTEGER, allowNull: false },
        license_plate: { type: DataTypes.STRING(30), allowNull: false },
        model: { type: DataTypes.STRING(100) },
        vin: { type: DataTypes.STRING(100) },
        mileage: { type: DataTypes.INTEGER },
        note: { type: DataTypes.TEXT }
    }, {
        tableName: 'vehicles',
        underscored: true,
        timestamps: true
    });

    Vehicle.associate = models => {
        Vehicle.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Vehicle.hasMany(models.Booking, { foreignKey: 'vehicle_id' });
        Vehicle.hasMany(models.WorkOrder, { foreignKey: 'vehicle_id' });
    };

    return Vehicle;
};
