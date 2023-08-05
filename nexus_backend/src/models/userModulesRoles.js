const userModulesRoles = (sequelize, DataTypes) => {
  const userModulesRole = sequelize.define('user_modules_roles', {
    modules_role_id: {
      type: DataTypes.INTEGER,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
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
    tableName: 'user_modules_roles',
  })

  userModulesRole.associate = (models) => {
    userModulesRole.belongsTo(models.modules_roles, {
      foreignKey: 'modules_role_id',
    })
  }
  return userModulesRole;
};

module.exports = userModulesRoles;