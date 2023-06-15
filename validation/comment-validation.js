const Joi = require("joi");

exports.commentValidation = (data) => {
  const schema = Joi.object({
    commentText: Joi.string().min(3).max(100).required(),
    id: Joi.string(),
  });

  return schema.validate(data);
};
