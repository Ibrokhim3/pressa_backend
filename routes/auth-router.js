const { Router } = require("express");
const userCtr = require("../controllers/auth-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const router = Router();

router.post("/signup", userValidate, userCtr.signup);
router.post("/login", userCtr.login);

module.exports = router;