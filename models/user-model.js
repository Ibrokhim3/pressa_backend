const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
    unique: true,
  },
  login: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    // required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
