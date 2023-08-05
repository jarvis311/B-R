'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.TINYINT,
        defaultValue:1
      },
      profile_img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references:{model:"roles",key:"id"},
        onDelete:"CASCADE",
        onUpdate:"CASCADE",
      },
      is_deleted: {
        type: Sequelize.TINYINT,
        defaultValue:0
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
      }
    }
    await queryInterface.createTable('users', users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};