const { Op } = require('sequelize');
const db = require('../../models');
const { responseModel } = require('../../responses');
const Menu = db.menu;

exports.getMenus = async (req, res) => {
  try {
    let menus = await getSubMenus();
    response = responseModel.successResponse("Success", menus)
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

const getSubMenus = async (menu) => {
  return new Promise(async function (resolve, reject) {
    let whereClause = {}
    if (menu) {
      whereClause = { menu_id: menu.id }
      menu = menu.dataValues
    }
    else {
      whereClause = { menu_id: { [Op.eq]: null } }
    }
    const menus = await Menu.findAll(
      {
        where: whereClause,
        attributes: ["id", "title", "slug", "order","status"],
        order: [
          ['order', 'ASC'],
        ],
      });

    if (menus && menus.length > 0) {
      if (!menu) {
        menu = []
      } else {
        menu.child = []
      }
      for (let i in menus) {
        let childMenu = await getSubMenus(menus[i]);
        if (!menu.child) {
          menu = [...menu, childMenu]
        } else {
          menu.child = [...menu.child, childMenu]
        }
      }
    }
    else {
      menu.child = [];
    }
    resolve(menu)
  })
}