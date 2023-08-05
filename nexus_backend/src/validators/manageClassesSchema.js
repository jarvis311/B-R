let Joi = require("joi");

const createManageClasses = Joi.object().keys({
  eventName: Joi.string().required(),
  Description: Joi.string().required(),
  type: Joi.string().required(),
  isplan: Joi.boolean(),
  planId: Joi.any(),
});

const updateManageClasses = Joi.object().keys({
  eventName: Joi.string().required(),
  Description: Joi.string().required(),
  type: Joi.string().required(),
  isplan: Joi.boolean(),
  planId: Joi.any(),
});

module.exports = {
  createManageClasses,
  updateManageClasses,
};
