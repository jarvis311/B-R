const pageBanner = (sequelize, DataTypes) => {
   const pageBanner=sequelize.define('pages_banner', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const name = this.getDataValue("name");
        return !name
          ? `${process.env.IMAGEPATH}/default.jpg`
          : `${process.env.IMAGEPATH}/banners/${name}`;
      },
    },
    page_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      defaultValue:0,
      allowNull: false,
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
  },{
    tableName: 'pages_banner',
  })
  pageBanner.associate = (models) => {
    pageBanner.belongsTo(models.pages, {
      foreignKey: 'page_id',
    })
  }
  return pageBanner
};

module.exports = pageBanner;