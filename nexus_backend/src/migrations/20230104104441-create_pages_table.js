'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pages = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      menu_id: {
        type: Sequelize.INTEGER,
        references: { model: "menu", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
      },
      short_description: {
        type: Sequelize.TEXT,
      },
      long_description: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.TINYINT,
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
    await queryInterface.createTable('pages', pages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pages');
  }
};
