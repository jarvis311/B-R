let Joi = require("joi");

let createCustomerSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
});

let upadetCustomerSchema = Joi.object().keys({
  email: Joi.string().email(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string(),
  isBlock: Joi.any(),
});

let forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

let resetPasswordSchema = Joi.object().keys({
  customerId: Joi.number().required(),
  password: Joi.string().required(),
});

module.exports = {
  createCustomerSchema,
  upadetCustomerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
