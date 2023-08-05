let Joi = require('joi')

const createPlanFeatureSchema = Joi.object().keys({
    planId: Joi.number().required(),
    planfeature: Joi.string().required(),
})

const updatePlanFeatureSchema = Joi.object().keys({
    planId: Joi.number().required(),
    planfeature: Joi.string(),
})

module.exports={
    createPlanFeatureSchema,
    updatePlanFeatureSchema
}