const rolePermission = (sequelize, DataTypes) => {
  return sequelize.define('role_permissions', {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
  
};

module.exports = rolePermission;