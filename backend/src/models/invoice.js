'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        work_order_id: { type: DataTypes.INTEGER },
        invoice_no: { type: DataTypes.STRING(100), unique: true },
        amount_due: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
        status: { type: DataTypes.ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID'), defaultValue: 'UNPAID' }
    }, {
        tableName: 'invoices',
        underscored: true,
        timestamps: true
    });

    Invoice.associate = models => {
        Invoice.belongsTo(models.WorkOrder, { foreignKey: 'work_order_id' });
        Invoice.hasMany(models.Payment, { foreignKey: 'invoice_id' });
    };

    return Invoice;
};
