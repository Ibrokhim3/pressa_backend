const { Router } = require("express");
const postCtr = require("../controllers/post-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const router = Router();

router.get("/get-all-posts", postCtr.GET_MODERATING_POSTS);
router.post("/add-post", postCtr.ADD_POST);
router.post("/test-upload", postCtr.POST_MODERATION);

module.exports = router;
