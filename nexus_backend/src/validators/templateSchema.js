let Joi = require('joi')

const createTemplateSchema = Joi.object().keys({
    name: Joi.string().required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
})

const updateTemplateSchema = Joi.object().keys({
    name: Joi.string().required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
})

module.exports={
    createTemplateSchema,
    updateTemplateSchema
}