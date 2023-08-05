const db = require("../../models");
const { responseModel } = require("../../responses");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { Sequelize } = require("sequelize");
const crypto = require("crypto");
const fs = require("fs");
const { mailTemplates } = require("../../utils");
const { mailService } = require("../../services");
const Customer = db.customer;

exports.getAllCustomer = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;

    let response = {};

    const customer = await Customer.findAll({
      limit: limit,
      offset: limit * (page - 1),
      attributes: { exclude: ["password"] },
    });
    const count = await Customer.count();
    response = responseModel.successResponse("Success", {
      customer,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.getCustomer = async (req, res) => {
  try {
    let response = {};
    let customer = await Customer.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] },
    });

    if (!customer) {
      response = responseModel.failResponse("Customer not found", {});
    } else {
      response = responseModel.successResponse("Success", customer);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.addCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const ifCustomerExist = await Customer.findOne({ where: { email: email } });

    if (ifCustomerExist) {
      let response = responseModel.failResponse("Customer Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let encryptPassword = await bcrypt.hash(password, 10);

    let customer = {
      firstName,
      lastName,
      email,
      password: encryptPassword,
      phone,
    };
    let response = {};

    return Customer.create(customer)
      .then(async (resp) => {
        response = responseModel.successResponse("Success", resp);
        res.status(response.status).send(response.data);
      })
      .catch((err) => {
        response = responseModel.failResponse("Something went wrong 1", {err: err.message});
        res.status(response.status).send(response.data);
      });
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong 2", {});
    return res.status(response.status).send(response.data);
  }
};

exports.updateCustomerByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, isBlock } = req.body;
    let customer = await Customer.findOne({
      where: { id },
    });

    if (!customer) {
      let response = responseModel.failResponse("Customer not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        firstName,
        lastName,
        email,
        phone,
        isBlock,
      };
      await Customer.update(updatedData, { where: { id } })
        .then(() => {
          let response = responseModel.successResponse(
            "Custromer updated successfully",
            {}
          );
          return res.status(response.status).send(response.data);
        })
        .catch((err) => {
          let response = responseModel.failResponse(err.message, {});
          return res.status(response.status).send(response.data);
        });
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      old_password,
      confirm_password,
    } = req.body;

    const customer = await Customer.findOne({
      where: { id: id },
    });
    let encryptPassword;

    if (old_password && old_password != "") {
      const passwordIsValid = bcrypt.compareSync(
        old_password,
        customer.dataValues.password
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

    if (!customer) {
      let response = responseModel.failResponse("Customer not found", {});
      return res.status(response.status).send(response.data);
    }

    const ifCustomerExist = await Customer.findOne({
      where: {
        email: email,
        id: {
          [Sequelize.Op.not]: id,
        },
      },
    });

    if (ifCustomerExist) {
      let response = responseModel.failResponse("Email Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let updatedData = {
      email,
      firstName,
      lastName,
    };
    if (encryptPassword) {
      updatedData.password = encryptPassword;
    }
    if (req.file) {
      if (customer.profile_img) {
        fs.unlink(
          `public/uploads/${customer.dataValues.profile_img}`,
          (err) => {}
        );
      }
      updatedData.profile_img = req.file.filename;
    }

    await Customer.update(updatedData, { where: { id: id } });

    const updatedCustomer = await Customer.findOne({
      where: { id: id },
    });

    const response = responseModel.successResponse(
      "Customer Updated Successfully",
      updatedCustomer
    );
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};


exports.updateCustomerIsBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlock } = req.body;
    let isBlockCustomer = await Customer.findOne({
      where: { id },
    });

    if (!isBlockCustomer) {
      let response = responseModel.failResponse("Customer not found", {})
      return res.status(response.status).send(response.data);
    } else {
      await Customer.update({ isBlock }, { where: { id } }).then(async () => {
        let response = responseModel.successResponse("Customer blocked successfully", {})
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

exports.deleteCustomer = async (req, res) => {
  try {
    let response = {};
    const { id } = req.params;
    const customer = await Customer.findOne({
      where: { id: id },
    });

    if (!customer) {
      response = responseModel.failResponse("Customer not found", {});
    } else {
      let updateData = {
        is_deleted: true,
        deleted_at: new Date(),
      };
      await Customer.update(updateData, { where: { id: id } });
      const updatedCustomer = await Customer.findOne({
        where: { id: id },
      });
      response = responseModel.successResponse(
        "Customer Deleted Successfully",
        updatedCustomer
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

    let customer = await Customer.findOne({
      where: { email: email },
    });

    if (!customer) {
      let response = responseModel.failResponse("Customer not found", {});
      return res.status(response.status).send(response.data);
    } else {
      customer.reset_token = crypto.randomBytes(20).toString("hex");
      customer.reset_expire_time = Date.now() + 3600000;
      customer.save();

      let body = mailTemplates.forgotMail(customer.reset_token);
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
    const customer = await Customer.findOne({
      where: {
        reset_token: reset_token,
        reset_expire_time: {
          [Sequelize.Op.gt]: moment(),
        },
      },
    });
    if (!customer) {
      let response = responseModel.failResponse(
        "Password reset token is invalid or has expired",
        {}
      );
      return res.status(response.status).send(response.data);
    } else {
      let response = responseModel.successResponse("Your Token is verified", {
        customerId: customer.id,
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
    const { customerId, password } = req.body;
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
      let response = responseModel.failResponse("Customer is not exists!!", {});
      return res.status(response.status).send(response.data);
    } else {
      let encryptPassword = await bcrypt.hash(password, 10);
      return Customer.update(
        {
          password: encryptPassword,
          reset_token: null,
          reset_expire_time: null,
        },
        { where: { id: customerId } }
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
