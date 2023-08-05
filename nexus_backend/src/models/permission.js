const permission = (sequelize, DataTypes) => {
    return sequelize.define('permissions', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    })
  };
  
  module.exports = permission;