const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postDate: {
    type: String,
    required: true,
  },
  postTime: {
    type: String,
    required: true,
  },
  postDir: {
    type: String,
    required: true,
  },
  postInnerDir: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
    required: true,
  },
  postLink: {
    type: String,
    required: true,
  },
  postImgUrl: {
    type: String,
    required: true,
  },
  speakerName: {
    type: String,
    required: true,
  },
  speakerJob: {
    type: String,
    required: true,
  },
  speakerTelNum: {
    type: String,
    required: true,
  },
  speakerTelNum2: {
    type: String,
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postDesc: {
    type: String,
    required: true,
  },
  postText: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
