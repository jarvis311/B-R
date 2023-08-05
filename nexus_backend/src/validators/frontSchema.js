let Joi = require('joi').extend(require('./sanitizer'));
const name_regex = /^[a-zA-Z]*$/

const addContactSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  first_name: Joi.string().regex(name_regex).messages({ 'string.pattern.base': `First name is invalid.` }).required(),
  last_name: Joi.string().regex(name_regex).messages({ 'string.pattern.base': `Last name is invalid.` }).required(),
  message: Joi.htmlStrip(Joi.string()).required(),
  phone: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` }).required()
})

const addNewsLetterSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().regex(name_regex).messages({ 'string.pattern.base': `First name is invalid.` }).required(),
})

module.exports = {
  addContactSchema,
  addNewsLetterSchema
}