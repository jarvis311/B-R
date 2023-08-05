'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',
      'is_global',
      {
        type: Sequelize.INTEGER,
        defaultValue:0,
        after: 'reset_token'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'users',
      'is_global'
    );
  }
};
