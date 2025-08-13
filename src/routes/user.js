const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const connectionRequests = await ConnectionRequest.find({
      receiverId: user._id,
      status: "smash",
    }).populate("senderId", [
      "firstName",
      "lastName",
      "gender",
      "skills",
      "photoUrl",
    ]);
    res.send(connectionRequests);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { receiverId: user._id, status: "accepted" },
        { senderId: user._id, status: "accepted" },
      ],
    })
      .populate("senderId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "photoUrl",
      ])
      .populate("receiverId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "photoUrl",
      ]);

    const connections = connectionRequests.map((item) => {
      if (item.receiverId.equals(user._id)) {
        return item.senderId;
      }
      return item.receiverId;
    });
    res.send({
      message: "fetched all connections!🙂",
      connections,
      totalConnection: connections.length,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page;
    let limit = req.query.limit;
    limit = limit > 50 ? 50 : limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ senderId: loggedInUser._id }, { receiverId: loggedInUser._id }],
    });

    const hideUsers = new Set();

    const users = connectionRequest.forEach((item) => {
      if (item.receiverId.equals(loggedInUser._id)) {
        hideUsers.add(item.senderId);
      } else if (item.senderId.equals(loggedInUser._id)) {
        hideUsers.add(item.receiverId);
      }
    });

    console.log("hideUsers", hideUsers);
    console.log("users", users);
    const feed = await user
      .find({
        $and: [
          {
            _id: {
              $nin: Array.from(hideUsers),
            },
          },
          {
            _id: {
              $ne: loggedInUser._id,
            },
          },
        ],
      })
      .select("firstName lastName photoUrl gender skills")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(feed);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
