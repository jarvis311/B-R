let Joi = require("joi");

let createUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  role_id: Joi.number().integer().required(),
});

let updateUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  role_id: Joi.number().integer(),
  old_password: Joi.string().empty(""),
  password: Joi.string().empty(""),
  confirm_password: Joi.string().empty(""),
});

let forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

let resetPasswordSchema = Joi.object().keys({
  userId: Joi.number().required(),
  password: Joi.string().required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
