const { Router } = require("express");
const postCtr = require("../controllers/post-controller");
const {
  userValidate,
  postValidate,
  commentValidate,
} = require("../middlewares/validation-middleware");
const { verifyToken } = require("../middlewares/auth-middleware");

const router = Router();

//posts

router.get("/get-moderating-posts", postCtr.GET_MODERATING_POSTS);
router.get("/get-active-posts", postCtr.GET_ACTIVE_POSTS);
router.post("/filter-active-posts", postCtr.FILTER_ACTIVE_POSTS);
router.get("/get-active-posts/:id", postCtr.GET_ONE_ACTIVE_POST);
router.get("/get-rejected-posts", postCtr.GET_REJECTED_POSTS);

//categories

router.get("/get-categories", postCtr.GET_CATEGORIES);
router.get("/get-names", postCtr.GET_NAMES);

//

router.post("/add-post", postValidate, postCtr.ADD_POST);
router.post("/moderate-post", postCtr.MODERATE_POSTS);

//comments

router.get("/get-comments", commentValidate, postCtr.GET_COMMENTS);

router.post("/add-comment", commentValidate, postCtr.ADD_COMMENT);

module.exports = router;
