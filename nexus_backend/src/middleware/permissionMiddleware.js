const { responseModel } = require("../responses");
const db = require('../models');
const ModuleRole = db.modules_roles;
const UserModuleRole = db.user_modules_roles;
const Module = db.modules;
const User = db.users;

let checkPermissions = (module, role) => {
  return async (req, res, next) => {
    try {
      const user = res.locals.user;
      const role_id = user.role_id;
      const roles = await Module.findOne({
        where: { index: module },
        attributes: ["index"],
        include: [
          {
            model: ModuleRole,
            required: true,
            attributes: [],
            where: { role },
            include: [
              {
                attributes: [],
                model: UserModuleRole,
                where: { role_id },
                required: true
              },
            ]
          },
        ]
      });

      if (roles) {
        next();
      }
      else {
        const user_id = user.id;
        const userData = await User.findOne({
          where: { is_global: 1, id: user_id },
          attributes: ["email"],
        })
        if (userData) {
          next();
        }
        else {
          const response = responseModel.failResponse("Forbidden")
          return res.status(403).send(response.data);
        }
      }
    }
    catch (err) {
      const response = responseModel.failResponse(err.message, {})
      return res.status(response.status).send(response.data);
    }
  }
}

module.exports = {
  checkPermissions,
};