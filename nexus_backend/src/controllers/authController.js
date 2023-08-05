const { responseModel } = require("../responses/");
const db = require("../models");
const { authService } = require("../services/");
const User = db.users;
const UserModuleRole = db.user_modules_roles;
const ModuleRole = db.modules_roles;
const Module = db.modules;
const bcrypt = require("bcrypt");

exports.adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let response = {};
    let user = await User.findOne({
      where: { email },
    });

    let modules = await Module.findAll({
      attributes: ["index"],
      include: [
        {
          model: ModuleRole,
          attributes: ["role"],
          required: true,
          include: [
            {
              model: UserModuleRole,
              required: true,
              attributes: [],
              where: { role_id: user.role_id },
            },
          ],
        },
      ],
    });

    if (!user) {
      response = responseModel.failResponse("Invalid email or password", {});
    } else {
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.dataValues.password
      );

      if (passwordIsValid) {
        const userData = user.dataValues;
        const token = await authService.generateToken(userData);
        user.dataValues.token = token;
        delete user.dataValues.password;
        for (let module of modules) {
          let roles = [];
          for (let role of module.modules_roles) {
            roles.push(role.dataValues.role);
          }
          module.dataValues.roles = roles;
          delete module.dataValues.modules_roles;
        }
        user.dataValues.modules = modules;

        response = responseModel.successResponse("Sign In successfull", user);
      } else {
        response = responseModel.failResponse("Invalid email or password", {});
      }
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};
