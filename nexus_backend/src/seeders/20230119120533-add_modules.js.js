'use strict';
const db = require('../models/index');
const Module = db.modules;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const module = {
      name: "Module",
      index: "modules",
      order: 1,
    }
    await Module.create(module);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
