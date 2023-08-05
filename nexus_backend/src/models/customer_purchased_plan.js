"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customer_purchased_plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // customer_purchased_plan.belongsTo(models.plan)
    }
  }
  customer_purchased_plan.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remaining_credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "customer_purchased_plan",
    }
  );
  return customer_purchased_plan;
};
