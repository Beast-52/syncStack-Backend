const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    about: {
      type: String,
      minLength: 20,
      maxLength: 100,
      default: "This is an Example !",
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      maxLength: 30,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minLength: 6,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough!");
        }
      },
    },
    age: {
      type: Number,
      min: 13,
      max: 100,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data isn't valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
      validate(value) {
        if (
          !validator.isURL(value) ||
          !/\.(jpg|jpeg|png|webp|gif)$/i.test(value)
        ) {
          throw new Error("photo url is not valid!");
        }
      },
    },
    skill: {
      type: [String],
      set: (skills) => skills.map((skill) => skill.toLowerCase()),

      validate(value) {
        if (value.length > 10) {
          throw new Error("Users can't have more than 10 skills!");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({firstName:1,lastName:1}, {unique:true})

userSchema.methods.bcryptCompare = async function (passwordUserInput) {
    const user = this;

    const passwordHash = user.password;

    return await bcrypt.compare(passwordUserInput, passwordHash);
  };
userSchema.methods.generateHash = async function (passwordUserInput) {
  if (!validator.isStrongPassword(passwordUserInput))
    throw new Error("Password is not strong enough!");
  return bcrypt.hash(passwordUserInput, 10);
};

userSchema.methods.jwtSign = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "$SyncStack@123", {
    expiresIn: "7d",
  });
  if (!token) throw new Error("token not generated");
  return token;
};
module.exports = mongoose.model("users", userSchema);
