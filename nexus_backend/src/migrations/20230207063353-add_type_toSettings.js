'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'system_settings',
      'type',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'value',
        defaultValue: "general"
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'system_settings',
      'type'
    );
  }
};
