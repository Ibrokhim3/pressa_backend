const { Router } = require("express");
const userCtr = require("../controllers/auth-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const router = Router();

router.post("/signup", userValidate, userCtr.SIGNUP);
router.post("/login", userCtr.LOGIN);

module.exports = router;
