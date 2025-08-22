const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Unauthorized - Token Not Found❌");

    const { _id } = await jwt.verify(token, "$SyncStack@123");

    const user = await User.findById(_id);
    if (!user) throw new Error("Invalid Tokens");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("middleware error :: auth :: " + error.message);
  }
};

module.exports = { userAuth };
