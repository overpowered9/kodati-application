'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_linked_products', {
      local_product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'products',
          key: 'id',
        },
      },
      provider_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'providers',
          key: 'id',
        },
      },
      provider_product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      min_price: {
        type: Sequelize.DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
      },
      max_price: {
        type: Sequelize.DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
      },
      currency_code: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      converted_price: {
        type: Sequelize.DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
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
    await queryInterface.dropTable('admin_linked_products');
  }
};