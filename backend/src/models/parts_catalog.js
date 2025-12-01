'use strict';
module.exports = (sequelize, DataTypes) => {
    const Part = sequelize.define('Part', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sku: { type: DataTypes.STRING(100), unique: true },
        name: { type: DataTypes.STRING(200), allowNull: false },
        unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
        unit: { type: DataTypes.STRING(20) },
        active: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
        tableName: 'parts_catalog',
        underscored: true,
        timestamps: true
    });

    Part.associate = models => {
        Part.hasMany(models.Stock, { foreignKey: 'part_id' });
        Part.hasMany(models.StockEntry, { foreignKey: 'part_id' });
    };

    return Part;
};
