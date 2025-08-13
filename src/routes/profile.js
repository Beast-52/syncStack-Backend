const express = require("express");
const User = require("../models/user");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
profileRouter.patch("/edit", userAuth, async (req, res) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "skill",
    "gender",
    "photoUrl",
    "age",
    "about",
  ];
  try {
    const userUpdate = req.body;
    const isEditAllowed = Object.keys(req.body).every((key) =>
      allowedEditFields.includes(key)
    );
    if (!isEditAllowed) throw new Error("Unauthorized Edit");
    const { user } = req;
    const updatedUser = await User.findByIdAndUpdate(user._id, userUpdate, {
      new: true,
      runValidators: true,
    });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
profileRouter.patch("/edit/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    console.log(currentPassword, newPassword);
    const isPreviousPasswordValid = await loggedInUser.bcryptCompare(
      currentPassword
    );
    if (!isPreviousPasswordValid)
      throw new Error("Current Password is not Valid");
    const encryptedPassword = await loggedInUser.generateHash(newPassword);

    loggedInUser.password = encryptedPassword;
    const updatedUser = await loggedInUser.save();
    res.json({
      message: "Password Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
