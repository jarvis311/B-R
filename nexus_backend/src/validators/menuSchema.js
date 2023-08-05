let Joi = require('joi')

const createMenuSchema = Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    menu_id: Joi.number().integer().empty(""),
    order: Joi.number(),
    status: Joi.number(),
})

const updateMenuSchema = Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string(),
    menu_id: Joi.number().integer().empty(""),
    order: Joi.number(),
    status: Joi.number(),
})

module.exports={
    createMenuSchema,
    updateMenuSchema
}