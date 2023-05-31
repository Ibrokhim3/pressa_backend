const mongoose = require("mongoose");

const nameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Name = mongoose.model("name", nameSchema);

module.exports = Name;
