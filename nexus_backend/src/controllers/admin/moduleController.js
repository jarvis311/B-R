const { rolesData } = require('../../constants/roles');
const db = require('../../models');
const { responseModel } = require('../../responses');
const Module = db.modules;
const ModuleRole = db.modules_roles;
const UserModuleRole = db.user_modules_roles;
const fs = require('fs');
const { Op } = require('sequelize');
const User = db.users;

exports.getAllModules = async (req, res) => {
  try {
    let { limit, page } = req.query

    let getObject = {}
   
    limit = limit ? parseInt(limit) : null;
    page = page ? parseInt(page) : null;

    if (limit && page) {
      getObject.limit = limit;
      getObject.offset = limit * (page - 1);
    }

    let response = {};
    const module = await Module.findAll(getObject);
    const count = await Module.count()

    response = responseModel.successResponse("Success", { module, total: count })
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}
exports.getAllRoleModules = async (req, res) => {
  try {
    let response = {};
    let user = res.locals.user;
    let userDetail = await User.findOne({
      where: { id: user.id },
      attributes: ["is_global"]
    });
    let include = [];
    if (!userDetail.is_global) {
      include = [
          {
            model: UserModuleRole,
            required: true,
            where: { role_id: user.role_id },
          },
        ];
    }

    const module = await Module.findAll({
      order: [
        ['order', 'ASC'],
      ],
      include: [
        {
          model: ModuleRole,
          required: true,
          attributes: ["role", "id"],
          include: include,
        },
      ],

    });
    let moduleList = [];

    for (let i in module) {
      let roles = [];
      if (module[i].modules_roles) {

        for (let role of module[i].modules_roles) {
          roles.push(role.role)
        }
      }
      module[i].dataValues.roles = roles;
      delete module[i].dataValues.modules_roles;
      if (roles.includes("read")) {
        moduleList = [...moduleList, module[i]]
      }
    }

    response = responseModel.successResponse("Success", moduleList)
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.getAllModuleRoles = async (req, res) => {
  try {
    const module = await Module.findAll({
      attributes: ["name", "index", "icon"],
      include: [
        {
          model: ModuleRole,
          attributes: ["id", "description", "role"],
          required: true
        },
      ],
    });
    let response = responseModel.successResponse("Success", module)
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.getModule = async (req, res) => {
  try {
    let response = {};
    let module = await Module.findOne({
      where: { id: req.params.id },
    });

    if (!module) {
      response = responseModel.failResponse("Module not found", {})
    }
    else {
      response = responseModel.successResponse("Success", module)
    }
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.addModule = async (req, res) => {
  try {
    const { name, order, index } = req.body;

    let response = {};
    let module = { name, order, index }
    if (req.file) {
      module.icon = req.file.filename;
    }
    return Module.create(module).then(async resp => {
      for (let data of rolesData) {
        await ModuleRole.create({ module_id: resp.dataValues.id, description: data.description, role: data.role });
      }
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

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order, index } = req.body;
    let module = await Module.findOne({
      where: { id },
    });

    if (!module) {
      let response = responseModel.failResponse("Module not found", {})
      return res.status(response.status).send(response.data);
    } else {

      let updatedData = {
        name, order, index
      }
      if (req.file) {
        if (module.dataValues.icon) {
          fs.unlink(`public/uploads/${module.dataValues.icon}`, (err => {
          }));
        }
        updatedData.icon = req.file.filename;
      }

      await Module.update(updatedData, { where: { id } }).then(() => {
        let response = responseModel.successResponse("Module updated successfully", {})
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

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    let module = await Module.findOne({
      where: { id },
    });
    if (!module) {
      let response = responseModel.failResponse("Module not found", {})
      return res.status(response.status).send(response.data);
    } else {
      const isDel = await Module.destroy({
        where: { id }
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse("Module Deleted Successfully", {})
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