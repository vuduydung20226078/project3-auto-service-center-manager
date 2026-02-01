'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        invoice_id: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        method: { type: DataTypes.ENUM('MOMO', 'VNPAY', 'CASH', 'CARD'), allowNull: false, defaultValue: 'CASH', field: 'provider' },
        status: { type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED'), allowNull: false, defaultValue: 'PENDING' },
        transaction_ref: { type: DataTypes.STRING(100), allowNull: true, unique: true },
        raw_response: { type: DataTypes.JSON, allowNull: true },
        paid_at: { type: DataTypes.DATE, allowNull: true },
        received_by: { type: DataTypes.INTEGER }
    }, {
        tableName: 'payments',
        underscored: true,
        timestamps: true
    });

    Payment.associate = models => {
        Payment.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
        Payment.belongsTo(models.User, { foreignKey: 'received_by' });
    };

    return Payment;
};
