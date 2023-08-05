'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'customers',
      'reset_expire_time',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue:null
      }
    );
    await queryInterface.addColumn(
      'customers',
      'reset_token',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    );
    await queryInterface.addColumn(
      'customers',
      'is_deleted',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    );
    await queryInterface.addColumn(
      'customers',
      'deleted_at',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
