const { Router } = require("express");
const postCtr = require("../controllers/post-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const router = Router();

router.post("/add-post", postCtr.ADD_POST);
router.post("/test-upload", postCtr.UPLOAD_TEST);

module.exports = router;
