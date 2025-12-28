'use strict';
module.exports = (sequelize, DataTypes) => {
    const Technician = sequelize.define('Technician', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('AVAILABLE', 'BUSY'),
            defaultValue: 'AVAILABLE',
            allowNull: false
        }
    }, {
        tableName: 'technicians',
        underscored: true,
        timestamps: true
    });

    Technician.associate = models => {
        Technician.belongsTo(models.User, { foreignKey: 'user_id' });
        Technician.hasMany(models.WorkOrder, { foreignKey: 'technician_id' });
    };

    return Technician;
};
