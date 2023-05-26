const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signup = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });

    if (user) {
      return res.status(400).json({ msg: "This user already exists" });
    }

    const hashedPsw = await bcrypt.hash(password, 12);

    let newUser = await User({ login, password: hashedPsw });

    await newUser.save();

    return res.status(201).json("Signup");
  } catch (error) {
    return console.log(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const comparePsw = await bcrypt.compare(password, user.password);

    if (!comparePsw) return res.status(401).json({ msg: "Invalid password!" });

    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_TIME,
    });

    res.status(201).json({ token, msg: "You're logged in" });
  } catch (error) {
    return console.log(error.message);
  }
};

module.exports = { login, signup };
