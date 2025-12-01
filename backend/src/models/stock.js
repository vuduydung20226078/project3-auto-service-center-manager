'use strict';
module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        part_id: { type: DataTypes.INTEGER, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        location: { type: DataTypes.STRING(100) },
        last_updated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        tableName: 'stocks',
        underscored: true,
        timestamps: true
    });

    Stock.associate = models => {
        Stock.belongsTo(models.Part, { foreignKey: 'part_id' });
    };

    return Stock;
};
