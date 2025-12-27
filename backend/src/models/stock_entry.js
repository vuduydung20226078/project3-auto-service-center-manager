'use strict';
module.exports = (sequelize, DataTypes) => {
    const StockEntry = sequelize.define('StockEntry', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        part_id: { type: DataTypes.INTEGER, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.ENUM('IN', 'OUT'), allowNull: false },
        ref_type: {
            type: DataTypes.ENUM('RET', 'ADJ', 'PO', 'WO', 'INV', 'DAMAGED', 'LOST', 'MANUAL'),
            allowNull: false,
            defaultValue: 'MANUAL',
            comment: 'RET=Return, ADJ=Adjustment, PO=Purchase Order, WO=Work Order, INV=Invoice'
        },
        created_by: { type: DataTypes.INTEGER }
    }, {
        tableName: 'stock_entries',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    StockEntry.associate = models => {
        StockEntry.belongsTo(models.Part, { foreignKey: 'part_id' });
        StockEntry.belongsTo(models.User, { foreignKey: 'created_by' });
    };

    return StockEntry;
};
