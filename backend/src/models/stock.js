'use strict';
module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
        part_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Default',
            primaryKey: true
        },
        qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
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

