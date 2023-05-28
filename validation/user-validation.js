const Joi = require("joi");

exports.signupValidation = (data) => {
  const schema = Joi.object({
    adminName: Joi.string().min(3).max(50).required(),
    login: Joi.string().min(3).max(15).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return schema.validate(data);
};
