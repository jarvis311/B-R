'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'users',
      'reset_token',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'role_id'
      }
    );
    await queryInterface.addColumn(
      'users',
      'reset_expire_time',
      {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'role_id'
      }
    );

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'users',
      'reset_token'
    );
    await queryInterface.removeColumn(
      'users',
      'reset_expire_time',
      Sequelize.STRING
    );
  }
};
