const Joi = require("joi");

exports.addPostValidation = (data) => {
  const schema = Joi.object({
    postDate: Joi.string().required(),
    postTime: Joi.string().required(),
    postDir: Joi.string().min(2).max(50).required(),
    postInnerDir: Joi.string().min(2).max(50).required(),
    postType: Joi.string().min(2).max(50).required(),
    postLink: Joi.string().min(2).max(50).required(),
    speakerName: Joi.string().min(2).max(50).required(),
    speakerJob: Joi.string().min(2).max(50).required(),
    speakerTelNum: Joi.number().required(),
    speakerTelNum2: Joi.number().required(),
    postTitle: Joi.string().min(2).max(50).required(),
    postDesc: Joi.string().min(2).max(100).required(),
    postText: Joi.string().min(2).max(1000).required(),
  });

  return schema.validate(data);
};
