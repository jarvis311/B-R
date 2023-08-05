let Joi = require('joi')

const createSettingSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
})

const updateSettingSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string(),
})

const createSocialLinkschema = Joi.object().keys({
    fb_link: Joi.string().allow(null, ''),
    insta_link: Joi.string().allow(null, ''),
    twitter_link: Joi.string().allow(null, ''),
    youtube_link: Joi.string().allow(null, ''),
})

module.exports={
    createSettingSchema,
    updateSettingSchema,
    createSocialLinkschema
}