const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const authRouter = require("./routes/auth-router");

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/pressa", authRouter);

connectToDb();

const PORT = process.env.PORT || 2001;

app.listen(PORT, () => {
  console.log(`Server ${PORT} is running`);
});
