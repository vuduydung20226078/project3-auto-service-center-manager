'use strict';
module.exports = (sequelize, DataTypes) => {
    const WorkOrderItem = sequelize.define('WorkOrderItem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        work_order_id: { type: DataTypes.INTEGER, allowNull: false },
        item_type: { type: DataTypes.ENUM('SERVICE', 'PART'), allowNull: false },
        item_id: { type: DataTypes.INTEGER, allowNull: false },
        description: { type: DataTypes.TEXT },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
        line_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 }
    }, {
        tableName: 'work_order_items',
        underscored: true,
        timestamps: true
    });

    WorkOrderItem.associate = models => {
        WorkOrderItem.belongsTo(models.WorkOrder, { foreignKey: 'work_order_id' });
        // Polymorphic: when item_type = 'SERVICE' => item_id references services_catalog
        // when item_type = 'PART' => item_id references parts_catalog
    };

    return WorkOrderItem;
};
