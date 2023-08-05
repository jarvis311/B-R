let Joi = require("joi");

const createPlanSchema = Joi.object().keys({
  planName: Joi.string().required(),
  planPrice: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.string(),
  offerBy: Joi.string().required(),
  credits: Joi.any(),
  startingDate: Joi.any(),
  endingDate: Joi.any(),
});

const updatePlanSchema = Joi.object().keys({
  planName: Joi.string().required(),
  planPrice: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.string(),
  offerBy: Joi.string().required(),
  credits: Joi.any(),
  startingDate: Joi.any(),
  endingDate: Joi.any(),
});

module.exports = {
  createPlanSchema,
  updatePlanSchema,
};
