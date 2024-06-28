"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cards", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      order_item_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "order_items",
          key: "id",
        },
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pin_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      claim_url: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("cards");
  },
};
