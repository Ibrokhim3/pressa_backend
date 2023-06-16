const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const SIGNUP = async (req, res) => {
  try {
    const { login, password, adminName } = req.body;

    const user = await User.findOne({ login });

    if (user) {
      return res.status(400).json({ msg: "This user already exists" });
    }

    const hashedPsw = await bcrypt.hash(password, 12);

    let newUser = await User({
      login,
      password: hashedPsw,
      adminName,
      userRole: "user",
    });

    await newUser.save();

    return res.status(201).json("Signup");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const LOGIN = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) return res.status(404).json("User not found");

    const comparePsw = await bcrypt.compare(password, user.password);

    if (!comparePsw) return res.status(401).json("Invalid password!");

    const userRole = user.userRole;

    const token = jwt.sign(
      { user_id: user._id, userRole },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_TIME,
      }
    );

    res.status(201).json({ token, userRole, msg: "You're logged in" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

module.exports = { LOGIN, SIGNUP };
