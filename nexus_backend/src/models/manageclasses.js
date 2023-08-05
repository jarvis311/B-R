// "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class manageClasses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      manageClasses.belongsTo(models.plan, { foreignKey: "planId" });
      manageClasses.hasMany(models.manage_schedule, { foreignKey: "classId" });
    }
  }
  manageClasses.init(
    {
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isplan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      deletedAt: { type: DataTypes.DATE, defaultValue: null },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "manageClasses",
    }
  );
  return manageClasses;
};
