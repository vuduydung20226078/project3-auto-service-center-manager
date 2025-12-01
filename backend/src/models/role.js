'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
    }, {
        tableName: 'roles',
        underscored: true,
        timestamps: true
    });

    Role.associate = models => {
        Role.hasMany(models.User, { foreignKey: 'role_id' });
    };

    return Role;
};
