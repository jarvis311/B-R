const db = require('../../models');
const { responseModel } = require('../../responses');
const Role = db.roles;
const ModuleRole = db.modules_roles;
const UserModuleRole = db.user_modules_roles;

exports.getAllRoles = async (req, res) => {
  try {
    let response = {};
    const roles = await Role.findAll({
      include: [
        {
          model: UserModuleRole,
          attributes:["id"],
          include: [
            {
              model: ModuleRole,
              attributes:["id"],
            },
          ]
        },
      ],
    });

    const count = await Role.count()

    for(let role of roles){
      let module_roles=[];
      for(let user_modules_role of role.user_modules_roles){
        module_roles=[...module_roles,user_modules_role?.modules_role?.id]
        
        role.dataValues.user_modules_role=module_roles;
        delete role.dataValues.user_modules_roles
      }
    }

    response = responseModel.successResponse("Success", { roles, total: count })
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.getRole = async (req, res) => {
  try {
    let response = {};
    let role = await Role.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: UserModuleRole,
          attributes:["id"],
          
          include: [
            {
              model: ModuleRole,
              attributes:["id"],
             
            },
          ]
        },
      ],
    });

    if (!role) {
      response = responseModel.failResponse("Role not found", {})
    }
    else {
        let module_roles=[];
        for(let user_modules_role of role.user_modules_roles){
          module_roles=[...module_roles,user_modules_role?.modules_role?.id]
          
          role.dataValues.user_modules_role=module_roles;
          delete role.dataValues.user_modules_roles
        }
      response = responseModel.successResponse("Success", role)
    }
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.addRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const ifRoleExist = await Role.findOne({ where: { name } })

    if (ifRoleExist) {
      let response = responseModel.failResponse("Role Already exist", {})
      return res.status(response.status).send(response.data);
    }

    let response = {};
    return Role.create({ name }).then(async resp => {
      if (permissions && permissions.length > 0) {
        for (let permission_id of permissions) {
          await UserModuleRole.create({ role_id: resp.dataValues.id, modules_role_id: permission_id })
        }
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


exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    let role = await Role.findOne({
      where: { id },
    });

    if (!role) {
      let response = responseModel.failResponse("Role not found", {})
      return res.status(response.status).send(response.data);
    } else {
      await Role.update({ name }, { where: { id } }).then(async () => {

        if (permissions && permissions.length > 0) {
          await UserModuleRole.destroy({ where: { role_id: id } })
          for (let permission_id of permissions) {
            await UserModuleRole.create({ role_id: id, modules_role_id: permission_id })
          }
        }
        let response = responseModel.successResponse("Role updated successfully", {})
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

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    let role = await Role.findOne({
      where: { id },
    });
    if (!role) {
      let response = responseModel.failResponse("Role not found", {})
      return res.status(response.status).send(response.data);
    } else {
      const isDel = await Role.destroy({
        where: { id }
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse("Role Deleted Successfully", {})
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