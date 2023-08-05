const modules = (sequelize, DataTypes) => {
  const module = sequelize.define('modules', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const icon = this.getDataValue("icon");
        return !icon
          ? null
          : `${process.env.IMAGEPATH}/${icon}`;
      },
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
    tableName: 'modules',
    paranoid: true,
  })
  module.associate = (models) => {
    module.hasMany(models.modules_roles, {
      foreignKey: 'module_id',
    })
  }
  return module;
};

module.exports = modules;