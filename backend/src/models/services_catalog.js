'use strict';
module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        code: { type: DataTypes.STRING(50), unique: true },
        name: { type: DataTypes.STRING(200), allowNull: false },
        description: { type: DataTypes.TEXT },
        price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
        duration_minutes: { type: DataTypes.INTEGER, defaultValue: 60 },
        active: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
        tableName: 'services_catalog',
        underscored: true,
        timestamps: true
    });

    Service.associate = models => {
        // relations if any
    };

    return Service;
};
