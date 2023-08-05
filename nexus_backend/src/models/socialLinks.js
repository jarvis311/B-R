const socialLinks = (sequelize, DataTypes) => {
    return sequelize.define('social_links', {
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const icon = this.getDataValue("icon");
                return !icon
                  ? null
                  : `${process.env.IMAGEPATH}/icons/${icon}`;
              },
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
        },
    }, {
    })
};

module.exports = socialLinks