'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const socialLinks = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      icon: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      url: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue:1
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
    }
    await queryInterface.createTable('social_links', socialLinks);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('social_links');
  }
};
