'use strict';
const db = require('../models/index');
const bcrypt = require("bcrypt");
const User = db.users;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let encryptPasword = await bcrypt.hash("12345678", 10)
    const admin = {
      first_name: "admin",
      email: "admin@admin.com",
      password: encryptPasword,
      role_id:1,
      is_global:1
    }
    await User.create(admin);
  },

  async down(queryInterface, Sequelize) {
  }
};
