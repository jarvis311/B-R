// "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class manage_schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      manage_schedule.belongsTo(models.manageClasses, {
        foreignKey: "classId",
      });
      manage_schedule.belongsTo(models.users, { foreignKey: "userId" });
    }
  }
  manage_schedule.init(
    {
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      isRepeat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      day: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "manage_schedule",
      paranoid: true,
    }
  );
  return manage_schedule;
};
