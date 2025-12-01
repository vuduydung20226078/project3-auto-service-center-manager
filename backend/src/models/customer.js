'use strict';
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING(150), allowNull: false },
        phone: { type: DataTypes.STRING(30) },
        email: { type: DataTypes.STRING(150) },
        address: { type: DataTypes.TEXT }
    }, {
        tableName: 'customers',
        underscored: true,
        timestamps: true
    });

    Customer.associate = models => {
        Customer.belongsTo(models.User, { foreignKey: 'user_id' });
        Customer.hasMany(models.Vehicle, { foreignKey: 'customer_id' });
        Customer.hasMany(models.Booking, { foreignKey: 'customer_id' });
    };

    return Customer;
};
