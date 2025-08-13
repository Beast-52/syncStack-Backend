const mogoose = require("mongoose");

const connectDB = async () => {
  await mogoose.connect(
    "mongodb+srv://Beast:kRNeJRUQpNnQrH9h@cluster01.f0m1bva.mongodb.net/test01"
  );
};
module.exports = connectDB;
//kRNeJRUQpNnQrH9h
//mongodb+srv://Beast:kRNeJRUQpNnQrH9h@cluster01.f0m1bva.mongodb.net/
