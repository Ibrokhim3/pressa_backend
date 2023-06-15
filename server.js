require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connect-to-db");
const authRouter = require("./routes/auth-router");
const postRouter = require("./routes/post-router");
const upload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(upload());
app.use(express.static(path.join(process.cwd(), "./assets")));

app.use("/pressa", authRouter);
app.use("/pressa", postRouter);

connectToDb();

const PORT = process.env.PORT || 2002;

app.listen(PORT, () => {
  console.log(`Server ${PORT} is running`);
});
