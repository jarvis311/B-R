let Joi = require('joi')

const sendNewsLetterSchema = Joi.object().keys({
    subject: Joi.string().required(),
    body: Joi.string().required(),
    users: Joi.array(),
})

module.exports = {
    sendNewsLetterSchema,
}