const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(400).json("You have to log in to the system!");
    }

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    const userRole = userData.userRole;

    if (userData && userRole === "admin") {
      return next();
    }
    return res
      .status(404)
      .json("Token doesn't exist or you are not authorized!");
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error (token)" });
  }
};
