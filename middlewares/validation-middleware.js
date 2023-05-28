const { signupValidation } = require("../validation/user-validation");

exports.userValidate = function (req, res, next) {
  try {
    const { error } = signupValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ msg: error.details[0].message });
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
