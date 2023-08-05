let Joi = require('joi')

const createModuleSchema = Joi.object().keys({
  name: Joi.string().required(),
  order: Joi.number().integer(),
  index: Joi.string().required(),
})

const updateModuleSchema = Joi.object().keys({
  name: Joi.string().required(),
  order: Joi.number().integer(),
  index: Joi.string().required(),
})

module.exports = {
  createModuleSchema,
  updateModuleSchema
}