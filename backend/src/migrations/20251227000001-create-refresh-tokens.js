'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('refresh_tokens', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE'
            },
            token: { type: Sequelize.TEXT, allowNull: false, unique: true },
            expires_at: { type: Sequelize.DATE, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
        });

        await queryInterface.addIndex('refresh_tokens', ['token']);
        await queryInterface.addIndex('refresh_tokens', ['user_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('refresh_tokens');
    }
};
