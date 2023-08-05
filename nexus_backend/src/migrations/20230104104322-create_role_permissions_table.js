'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rolePermissions = {
      role_id: {
        type: Sequelize.INTEGER,
        references:{model:"roles",key:"id"},
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
      },
      permission_id: {
        type: Sequelize.INTEGER,
        references:{model:"permissions",key:"id"},
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
      },
    }
    await queryInterface.createTable('role_permissions', rolePermissions);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};
