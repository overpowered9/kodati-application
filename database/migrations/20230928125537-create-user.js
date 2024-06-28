'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      mobile: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      manager_token: {
        type: Sequelize.STRING(1500)
      },
      access_token: {
        type: Sequelize.STRING(1500)
      },
      refresh_token: {
        type: Sequelize.STRING(1500)
      },
      access_token_created: {
        type: Sequelize.DATE
      },
      access_token_expired: {
        type: Sequelize.DATE
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
      },
      provider: {
        type: Sequelize.ENUM('salla', 'zid')
      },
      metadata: {
        type: Sequelize.JSON,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};