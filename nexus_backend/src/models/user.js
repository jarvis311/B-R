const users = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const profile = this.getDataValue("profile_img");
        return !profile
          ? `${process.env.IMAGEPATH}/default.jpg`
          : `${process.env.IMAGEPATH}/${profile}`;
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reset_expire_time: {
      type: DataTypes.DATE,
    },
    reset_token: {
      type: DataTypes.STRING,
    },
    is_global:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
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
  })
  
  user.associate = (models) => {
    user.belongsTo(models.roles, {
      foreignKey: 'role_id',
    }),
    user.hasOne(models.manage_schedule,{foreignKey:'userId'})
  }
  return user;
};

module.exports = users