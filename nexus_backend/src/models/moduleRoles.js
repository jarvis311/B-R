const modulesRoles = (sequelize, DataTypes) => {
  const modulesRole = sequelize.define('modules_roles', {
    module_id: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.INTEGER,
    },
    role: {
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
    tableName: 'modules_roles',
    paranoid: true,
  })

  modulesRole.associate = (models) => {
    modulesRole.hasMany(models.user_modules_roles, {
      foreignKey: 'modules_role_id',
    });
    modulesRole.belongsTo(models.modules, {
      foreignKey: 'module_id',
    })
  }
  
  return modulesRole;
};

module.exports = modulesRoles;