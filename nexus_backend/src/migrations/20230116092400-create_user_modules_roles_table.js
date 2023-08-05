'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userModuleRoles = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      modules_role_id: {
        type: Sequelize.INTEGER,
        references: { model: "modules_roles", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: { model: "roles", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    }
    await queryInterface.createTable('user_modules_roles', userModuleRoles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_modules_roles');
  }
};
