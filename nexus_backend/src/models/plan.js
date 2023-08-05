// "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      plan.hasOne(models.manageClasses, { foreignKey: "planId" });
      plan.hasOne(models.booking, { foreignKey: "planId" });
      plan.hasMany(models.customer_purchased_plan, {
        as: "customer_purchased_plans",
        foreignKey: "plan_id",
      });
    }
  }
  plan.init(
    {
      planName: { type: DataTypes.STRING, allowNull: false },
      planPrice: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      features: { type: DataTypes.TEXT, allowNull: false },
      offerBy: { type: DataTypes.STRING, allowNull: false },
      credits: { type: DataTypes.BIGINT, allowNull: true, defaultValue: null },
      startingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      endingDate: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    },
    {
      sequelize,
      modelName: "plan",
      paranoid: true,
    }
  );
  return plan;
};
