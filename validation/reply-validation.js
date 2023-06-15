const Joi = require("joi");

exports.replyValidation = (data) => {
  const schema = Joi.object({
    replyText: Joi.string().min(3).max(100).required(),
    id: Joi.string(),
    commentId: Joi.string(),
  });

  return schema.validate(data);
};
