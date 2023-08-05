let Joi = require('joi')

const createRoleSchema = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array()
})

const updateRoleSchema = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array()
})

module.exports={
    createRoleSchema,
    updateRoleSchema
}