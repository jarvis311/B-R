const db = require('../../models');
const { responseModel } = require('../../responses');
const Menu = db.menu;

exports.getAllMenus = async (req, res) => {
  try {
    let { limit, page } = req.query
    let getObject = {
      order: [
        ['id', 'DESC'],
      ],
      include: [
        {
          model: Menu,
          attributes: ["title", "slug", "order"],
          as: "parent"
        },
      ]
    }

    limit = limit ? parseInt(limit) : null;
    page = page ? parseInt(page) : null;
    if (limit && page) {
      getObject.limit = limit;
      getObject.offset = limit * (page - 1);
    }

    let response = {};

    const menus = await Menu.findAll(getObject);
    const count = await Menu.count()

    response = responseModel.successResponse("Success", { menus, total: count })
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.getMenu = async (req, res) => {
  try {
    let response = {};
    let menu = await Menu.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Menu,
          attributes: ["title", "slug", "order"],
          as: "parent"
        },
      ]
    });

    if (!menu) {
      response = responseModel.failResponse("Menu not found", {})
    }
    else {
      response = responseModel.successResponse("Success", menu)
    }
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.addMenu = async (req, res) => {
  try {
    const { title, slug, menu_id, order, status } = req.body;
    const ifMenuExist = await Menu.findOne({ where: { slug } })

    if (ifMenuExist) {
      let response = responseModel.failResponse("Menu Already exist", {})
      return res.status(response.status).send(response.data);
    }

    let menu = {
      title, slug, order, status
    }
    if (menu_id) {
      menu.menu_id = menu_id;
    }

    let response = {};

    return Menu.create(menu).then(async resp => {
      response = responseModel.successResponse("Success", resp)
      res.status(response.status).send(response.data);
    }).catch(err => {
      response = responseModel.failResponse(err.message, {})
      res.status(response.status).send(response.data);
    })
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, menu_id, order } = req.body;
    let menu = await Menu.findOne({
      where: { id },
    });

    if (!menu) {
      let response = responseModel.failResponse("Menu not found", {})
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        title, slug, order
      }
      if (menu_id != "") {
        updatedData.menu_id = menu_id
      }

      await Menu.update(updatedData, { where: { id } }).then(() => {
        let response = responseModel.successResponse("Menu updated successfully", {})
        return res.status(response.status).send(response.data);
      }).catch(err => {
        let response = responseModel.failResponse(err.message, {})
        return res.status(response.status).send(response.data);
      })
    }
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    let menu = await Menu.findOne({
      where: { id },
    });
    if (!menu) {
      let response = responseModel.failResponse("Menu not found", {})
      return res.status(response.status).send(response.data);
    } else {
      await Menu.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await Menu.destroy({
        where: { id }
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse("Menu Deleted Successfully", {})
      }
      else {
        response = responseModel.failResponse("Something went wrong", {})
      }
      return res.status(response.status).send(response.data);
    }
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}