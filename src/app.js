const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connection");
const userRouter = require("./routes/user");
const port = 7777;
app.use(express.json());
app.use(cookieParser());

//test route

app.get("/", async (req, res) => {
  res.send("Hello World ✅");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/connection", connectionRouter);
app.use("/user", userRouter);
connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => console.log(err.message));
