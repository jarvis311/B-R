let Joi = require('joi')

const createPageSchema = Joi.object().keys({
    title: Joi.string().required(),
    menu_id: Joi.number().integer(),
    short_description: Joi.string().required(),
    long_description: Joi.string().required(),
    status: Joi.number(),
})

const updatePageSchema = Joi.object().keys({
    title: Joi.string(),
    menu_id: Joi.number().integer(),
    short_description: Joi.string(),
    long_description: Joi.string(),
    status: Joi.number(),
})

module.exports={
    createPageSchema,
    updatePageSchema
}