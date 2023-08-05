const roles = (sequelize, DataTypes) => {
  const role = sequelize.define('roles', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: false })

  role.associate = (models) => {
    role.hasMany(models.user_modules_roles, {
      foreignKey: 'role_id',
    })
  }
  return role
};

module.exports = roles;