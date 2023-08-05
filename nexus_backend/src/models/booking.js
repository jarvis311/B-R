// "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {

    static associate(models) {
      // define association here
      booking.belongsTo(models.customer)
      booking.belongsTo(models.manage_schedule,{foreignKey:'scheduleId'})
      booking.belongsTo(models.plan)
    }
  }
  booking.init(
    {
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: false,
      },
      credits: {
        type: DataTypes.BIGINT,
        allowNull: false, 
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:null
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "booking",
    }
  );
  return booking;
};
