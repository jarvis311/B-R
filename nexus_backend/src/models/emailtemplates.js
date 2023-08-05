// 'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class email_templates extends Model {
    static associate(models) {
    }
  }
  email_templates.init({
    name: DataTypes.STRING,
    subject: DataTypes.TEXT,
    body: DataTypes.TEXT,
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'email_templates',
    paranoid: true,
  });
  return email_templates;
};