const express = require("express");
const connectionRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

connectionRouter.post(
  "/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    try {
      const receiverId = req.params.receiverId;
      const senderId = req.user._id;
      const status = req.params.status;
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { receiverId, senderId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      const validStatus = ["smash", "pass"];
      const isStatusValid = validStatus.includes(status);
      if (!isStatusValid) throw new Error("Status is not valid!");
      if (existingConnectionRequest)
        throw new Error("Connection already exists!");
      const connectionRequest = await ConnectionRequest.create({
        senderId,
        receiverId,
        status,
      });
      res.send(connectionRequest);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);
connectionRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const validStatus = ["accepted", "rejected"];
      if (!validStatus.includes(status)) {
        throw new Error("Status is not valid!");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: loggedInUser._id,
        status: "smash",
      });
      if (!connectionRequest) {
        throw new Error("Connection request not found!");
      }
      if (!connectionRequest.receiverId.equals(loggedInUser._id)) {
        throw new Error("You are not authorized to review this request!");
      }
      connectionRequest.status = status;
      const updatedConnectionRequest = await connectionRequest.save();
      res.status(200).json({
        message: "Connection Request Reviewed Successfully!",
        updatedConnectionRequest,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);
module.exports = connectionRouter;
