'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const emailSettings = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.TEXT("long"),
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
    await queryInterface.createTable('email_settings', emailSettings);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('email_settings');
  }
};
