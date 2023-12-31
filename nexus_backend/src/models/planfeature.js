'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class planfeature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  planfeature.init({
    planId: DataTypes.INTEGER,
    planfeature: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'planfeature',
  });
  return planfeature;
};