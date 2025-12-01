'use strict';
module.exports = (sequelize, DataTypes) => {
    const StockEntry = sequelize.define('StockEntry', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        part_id: { type: DataTypes.INTEGER, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.ENUM('IN', 'OUT'), allowNull: false },
        ref: { type: DataTypes.STRING(200) },
        created_by: { type: DataTypes.INTEGER }
    }, {
        tableName: 'stock_entries',
        underscored: true,
        timestamps: false
    });

    StockEntry.associate = models => {
        StockEntry.belongsTo(models.Part, { foreignKey: 'part_id' });
        StockEntry.belongsTo(models.User, { foreignKey: 'created_by' });
    };

    return StockEntry;
};
