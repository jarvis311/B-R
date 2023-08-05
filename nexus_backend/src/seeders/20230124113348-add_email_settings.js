'use strict';
const db = require('../models/index');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const Settings = [
      { key: "header" },
      { key: "footer" },
      { key: "host" },
      { key: "port" },
      { key: "user" },
      { key: "password" },
    ];
    await queryInterface.bulkInsert('email_settings', Settings, {});
  },

  async down (queryInterface, Sequelize) {
  }
};
