'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const newsLetter = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.createTable('news_letters', newsLetter);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('news_letters');
  }
};
