'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        role_id: { type: DataTypes.INTEGER },
        username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        password_hash: { type: DataTypes.TEXT, allowNull: false },
        full_name: { type: DataTypes.STRING(150), allowNull: true },
        phone: { type: DataTypes.STRING(30), allowNull: true },
        email: { type: DataTypes.STRING(150), allowNull: false, unique: true }
    }, {
        tableName: 'users',
        underscored: true,
        timestamps: true
    });

    User.associate = models => {
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
        User.hasMany(models.Customer, { foreignKey: 'user_id' });
        User.hasMany(models.StockEntry, { foreignKey: 'created_by' });
        User.hasMany(models.Assignment, { foreignKey: 'technician_id' });
        User.hasMany(models.Invoice, { foreignKey: 'created_by', constraints: false });
        User.hasMany(models.Payment, { foreignKey: 'received_by' });
        User.hasMany(models.AuditLog, { foreignKey: 'user_id' });
    };

    return User;
};
