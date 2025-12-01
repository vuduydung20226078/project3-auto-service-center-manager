'use strict';
module.exports = (sequelize, DataTypes) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER },
        action: { type: DataTypes.TEXT, allowNull: false },
        meta: { type: DataTypes.JSONB }
    }, {
        tableName: 'audit_logs',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    AuditLog.associate = models => {
        AuditLog.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return AuditLog;
};
