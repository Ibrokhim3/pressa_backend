const { addPostValidation } = require("../validation/post-validation");
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
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

exports.postValidate = function (req, res, next) {
  try {
    const { error } = addPostValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ msg: error.details[0].message });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
