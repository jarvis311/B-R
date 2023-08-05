let Joi = require("joi");

let createBookingSchema = Joi.object().keys({
  customerId: Joi.number().required(),
  scheduleId: Joi.number().required(),
  planId: Joi.number(),
  credits: Joi.number(),
});

let upadetBookingSchema = Joi.object().keys({
  customerId: Joi.number().required(),
  scheduleId: Joi.number().required(),
  planId: Joi.number(),
  credits: Joi.number(),
});

module.exports = {
  createBookingSchema,
  upadetBookingSchema,
};
