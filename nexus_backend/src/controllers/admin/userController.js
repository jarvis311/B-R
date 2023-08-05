const db = require("../../models");
const User = db.users;
const { responseModel } = require("../../responses");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { Sequelize } = require("sequelize");
const crypto = require("crypto");
const fs = require("fs");
const { mailTemplates } = require("../../utils");
const { mailService, authService } = require("../../services");
const UserModuleRole = db.user_modules_roles;
const ModuleRole = db.modules_roles;
const Module = db.modules;

exports.getAllUsers = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;

    let response = {};

    const users = await User.findAll({
      limit: limit,
      where: { is_deleted: 0 },
      offset: limit * (page - 1),
      attributes: { exclude: ["password"] },
    });
    const count = await User.count({ where: { is_deleted: 0 } });

    response = responseModel.successResponse("Success", {
      users,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.getUser = async (req, res) => {
  try {
    let response = {};
    let user = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      response = responseModel.failResponse("User not found", {});
    } else {
      response = responseModel.successResponse("Success", user);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    let response = {};
    let user = await User.findOne({
      where: { id: res.locals.user.id },
      attributes: { exclude: ["password"] },
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
      response = responseModel.failResponse("User not found", {});
    } else {
      for (let module of modules) {
        let roles = [];
        for (let role of module.modules_roles) {
          roles.push(role.dataValues.role);
        }
        module.dataValues.roles = roles;
        delete module.dataValues.modules_roles;
      }
      user.dataValues.modules = modules;
      const userData = user.dataValues;
      const token = await authService.generateToken(userData);
      user.dataValues.token = token;
      response = responseModel.successResponse("Success", user);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.addUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role_id } = req.body;
    const ifUserExist = await User.findOne({ where: { email: email } });

    if (ifUserExist) {
      let response = responseModel.failResponse("User Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let encryptPassword = await bcrypt.hash(password, 10);

    let user = {
      first_name,
      last_name,
      email,
      password: encryptPassword,
      role_id,
    };
    if (req.file) {
      user.profile_img = req.file.filename;
    }
    let response = {};

    return User.create(user)
      .then(async (resp) => {
        response = responseModel.successResponse("Success", resp);
        res.status(response.status).send(response.data);
      })
      .catch((err) => {
        response = responseModel.failResponse("Something went wrong", {});
        res.status(response.status).send(response.data);
      });
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      password,
      old_password,
      confirm_password,
      first_name,
      last_name,
      role_id,
    } = req.body;

    const user = await User.findOne({
      where: { id: id },
    });
    let encryptPassword;

    if (old_password && old_password != "") {
      const passwordIsValid = bcrypt.compareSync(
        old_password,
        user.dataValues.password
      );
      if (!passwordIsValid) {
        let response = responseModel.failResponse("Password is invalid");
        return res.status(response.status).send(response.data);
      } else if (
        !password ||
        !confirm_password ||
        password != confirm_password
      ) {
        let response = responseModel.failResponse(
          "Password and Confirm Password does not match"
        );
        return res.status(response.status).send(response.data);
      } else {
        encryptPassword = await bcrypt.hash(password, 10);
      }
    }

    if (!user) {
      let response = responseModel.failResponse("User not found", {});
      return res.status(response.status).send(response.data);
    }

    const ifUserExist = await User.findOne({
      where: {
        email: email,
        id: {
          [Sequelize.Op.not]: id,
        },
      },
    });

    if (ifUserExist) {
      let response = responseModel.failResponse("Email Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let updatedData = {
      email,
      first_name,
      last_name,
      role_id,
    };
    if (encryptPassword) {
      updatedData.password = encryptPassword;
    }
    if (req.file) {
      if (user.profile_img) {
        fs.unlink(`public/uploads/${user.dataValues.profile_img}`, (err) => {});
      }
      updatedData.profile_img = req.file.filename;
    }

    await User.update(updatedData, { where: { id: id } });

    const updatedUser = await User.findOne({
      where: { id: id },
    });

    const response = responseModel.successResponse(
      "User Updated Successfully",
      updatedUser
    );
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let response = {};
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: id },
    });

    if (!user) {
      response = responseModel.failResponse("User not found", {});
    } else {
      let updateData = {
        is_deleted: 1,
        deleted_at: new Date(),
      };
      await User.update(updateData, { where: { id: id } });
      const updatedUser = await User.findOne({
        where: { id: id },
      });
      response = responseModel.successResponse(
        "User Deleted Successfully",
        updatedUser
      );
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      let response = responseModel.failResponse("User not found", {});
      return res.status(response.status).send(response.data);
    } else {
      user.reset_token = crypto.randomBytes(20).toString("hex");
      user.reset_expire_time = Date.now() + 3600000;
      user.save();

      let body = mailTemplates.forgotMail(user.reset_token);
      let response = {};

      let send = await mailService.sendMail("Forgot Password", body, email);
      if (send) {
        response = responseModel.successResponse(
          `Reset email has been sent to ${email}`,
          {}
        );
        return res.status(response.status).send(response.data);
      } else {
        response = responseModel.failResponse("Something went wrong", {});
      }
      return res.status(response.status).send(response.data);
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { reset_token } = req.body;
    const user = await User.findOne({
      where: {
        reset_token: reset_token,
        reset_expire_time: {
          [Sequelize.Op.gt]: moment(),
        },
      },
    });
    if (!user) {
      let response = responseModel.failResponse(
        "Password reset token is invalid or has expired",
        {}
      );
      return res.status(response.status).send(response.data);
    } else {
      let response = responseModel.successResponse("Your Token is verified", {
        userId: user.id,
      });
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ id: userId });
    if (!user) {
      let response = responseModel.failResponse("User is not exists!!", {});
      return res.status(response.status).send(response.data);
    } else {
      let encryptPassword = await bcrypt.hash(password, 10);
      return User.update(
        {
          password: encryptPassword,
          reset_token: null,
          reset_expire_time: null,
        },
        { where: { id: userId } }
      ).then((resp) => {
        response = responseModel.successResponse(
          "Your password has been updated",
          {}
        );
        res.status(response.status).send(response.data);
      });
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};
