const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["smash", "pass", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

connectionSchema.pre("save", async function (next) {
  if (this.receiverId.equals(this.senderId))
    throw new Error("Cannot send connection request to yourself!");
  next();
});
const ConnectionRequest = mongoose.model(
  "connectionRequests",
  connectionSchema
);
module.exports = ConnectionRequest;
