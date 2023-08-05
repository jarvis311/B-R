const page = (sequelize, DataTypes) => {
  const pages = sequelize.define('pages', {
    menu_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_description: {
      type: DataTypes.STRING,
    },
    long_description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:1
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue:0
    },
    deleted_at: {
      type: DataTypes.DATE,
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
    paranoid: true,
  })
  pages.associate = (models) => {
    pages.hasMany(models.pages_banner, {
      foreignKey: 'page_id',
    })
    pages.belongsTo(models.menu, {
      foreignKey: 'menu_id',
    })
  }
  return pages
};

module.exports = page;