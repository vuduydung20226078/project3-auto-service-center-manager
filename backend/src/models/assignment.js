'use strict';
module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        work_order_id: { type: DataTypes.INTEGER, allowNull: false },
        technician_id: { type: DataTypes.INTEGER, allowNull: false },
        assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        status: { type: DataTypes.ENUM('ASSIGNED', 'ACCEPTED', 'REJECTED', 'DONE'), defaultValue: 'ASSIGNED' }
    }, {
        tableName: 'assignments',
        underscored: true,
        timestamps: true
    });

    Assignment.associate = models => {
        Assignment.belongsTo(models.WorkOrder, { foreignKey: 'work_order_id' });
        Assignment.belongsTo(models.User, { foreignKey: 'technician_id' });
    };

    return Assignment;
};
