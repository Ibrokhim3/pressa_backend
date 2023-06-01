const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_PORT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected..."))
      .catch((err) => console.log(err));
  } catch (error) {
    return console.log(error.message);
  }
};

module.exports = connectDb;
