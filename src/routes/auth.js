const express = require("express");
const User = require("../models/user");
const { signUpValidator } = require("../utils/validator");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  console.log("BODY:", req.body);
  try {
    //validate the user
    signUpValidator(req.body);
    //encrypt password
    const tempUser = new User();
    const encryptedPassword = await tempUser.generateHash(req.body.password);
    //create a new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword,
    });
    //save the user

    await newUser.save();
    res.send("User saved");
    console.log("User saved");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("invalid credintials");

    const isPasswordValid = await user.bcryptCompare(password);
    if (!isPasswordValid) throw new Error("invalid credintials");
    const token = await user.jwtSign();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.send("user logged in");
  } catch (error) {
    res.status(400).send("login route : " + error.message);
  }
});
authRouter.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("user logged out");
});

module.exports = authRouter;
