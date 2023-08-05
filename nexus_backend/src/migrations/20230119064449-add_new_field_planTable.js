// "use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "plans",
          "description",
          {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "plans",
          "features",
          {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "plans",
          "credits",
          {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "plans",
          "offerBy",
          {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "plans",
          "startingDate",
          {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "plans",
          "endingDate",
          {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
