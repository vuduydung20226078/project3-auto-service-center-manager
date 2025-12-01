'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        invoice_id: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        method: { type: DataTypes.ENUM('CASH', 'CARD', 'BANK_TRANSFER') },
        paid_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
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
