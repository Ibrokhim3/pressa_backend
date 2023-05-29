const { Router } = require("express");
const postCtr = require("../controllers/post-controller");
const { userValidate } = require("../middlewares/validation-middleware");

const router = Router();

router.get("/get-moderating-posts", postCtr.GET_MODERATING_POSTS);
router.get("/get-active-posts", postCtr.GET_ACTIVE_POSTS);
// router.get("/get-active-posts", postCtr.SEARCH_ACTIVE_POSTS);
router.get("/get-active-posts/:id", postCtr.GET_ONE_ACTIVE_POST);
router.get("/get-deleted-posts", postCtr.GET_DELETED_POSTS);
router.post("/add-post", postCtr.ADD_POST);
router.post("/moderate-post", postCtr.MODERATE_POSTS);

module.exports = router;
