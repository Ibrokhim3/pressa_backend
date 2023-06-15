const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  time: { type: Date, default: Date.now },
  reply: [
    {
      replyText: { type: String },
      time: { type: Date, default: Date.now },
    },
  ],
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
