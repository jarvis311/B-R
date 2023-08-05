'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pagesBanner = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      page_id: {
        type: Sequelize.INTEGER,
        references: { model: "pages", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      is_deleted: {
        type: Sequelize.TINYINT,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      deleted_at: {
        type: Sequelize.DATE,
      }
    }
    await queryInterface.createTable('pages_banner', pagesBanner);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pages_banner');
  }
};
