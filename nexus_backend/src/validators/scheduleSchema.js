let Joi = require("joi");

const createManageScheduleSchema = Joi.object().keys({
  classId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  userId: Joi.number(),
  isRepeat: Joi.boolean(),
  day: Joi.number(),
});

const updateManageScheduleSchema = Joi.object().keys({
classId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  userId: Joi.number(),
  isRepeat: Joi.boolean().required(),
  day: Joi.number(),
});

module.exports = {
  createManageScheduleSchema,
  updateManageScheduleSchema,
};
