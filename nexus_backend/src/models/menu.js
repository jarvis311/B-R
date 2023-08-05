const menu = (sequelize, DataTypes) => {
  const menu = sequelize.define('menu', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    menu_id: {
      type: DataTypes.INTEGER,
      get() {
        const menu_id = this.getDataValue("menu_id");
        return !menu_id ? 0 : menu_id
      }
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'menu',
    paranoid: true,
  })
  menu.associate = (models) => {
    menu.hasOne(models.pages, {
      foreignKey: 'menu_id',
    })
    menu.belongsTo(models.menu, {
      foreignKey: 'menu_id',
      as: 'parent'
    })
    menu.hasOne(models.menu, {
      foreignKey: 'menu_id',
      as: 'child'
    })
  }
  return menu;
};

module.exports = menu;