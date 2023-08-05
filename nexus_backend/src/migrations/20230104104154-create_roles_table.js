'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      }
    }
    await queryInterface.createTable('roles', roles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
