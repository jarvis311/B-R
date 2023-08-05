const { responseModel } = require("../responses");
const db = require("../models");
const { authService } = require("../services");
const Customer = db.customer;
const ModuleRole = db.modules_roles;
const Module = db.modules;
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let response = {};
    let customer = await Customer.findOne({
      where: { email },
    });

    let modules = await Module.findAll({
      attributes: ["index"],
      include: [
        {
          model: ModuleRole,
          attributes: ["role"],
          required: true,
        },
      ],
    });

    if (!customer) {
      response = responseModel.failResponse("Invalid email or password", {});
    } else {
      if (customer.isBlock) {
        response = responseModel.failResponse("User is block!!");
      } else {
        const passwordIsValid = bcrypt.compareSync(
          password,
          customer.dataValues.password
        );
        if (passwordIsValid) {
          const customerData = customer.dataValues;
          const token = await authService.generateToken(customerData);
          customer.dataValues.token = token;
          delete customer.dataValues.password;
          for (let module of modules) {
            let roles = [];
            for (let role of module.modules_roles) {
              roles.push(role.dataValues.role);
            }
            module.dataValues.roles = roles;
            delete module.dataValues.modules_roles;
          }
          customer.dataValues.modules = modules;

          response = responseModel.successResponse(
            "Sign In successfull",
            customer
          );
        } else {
          response = responseModel.failResponse(
            "Invalid email or password",
            {}
          );
        }
      }
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};
