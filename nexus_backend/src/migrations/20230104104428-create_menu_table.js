'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const menu = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.TINYINT,
      },
      menu_id: {
        type: Sequelize.INTEGER,
        references:{model:"menu",key:"id"},
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
      },
      is_deleted: {
        type: Sequelize.TINYINT,
      },
      order: {
        type: Sequelize.INTEGER,
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
    await queryInterface.createTable('menu', menu);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('menu');
  }
};
