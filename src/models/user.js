const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//IF YOU ADD A VALIDATION HERE THAT'S CALLED A SCHEMA/DB LEVEL VALIDAITON
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 10,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      //(BY DEFAULT) custom validation function does not work when you are updating a document in the db, it works when you are creating one.
    },
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/y1Qth0X4kYL_h-xne5PY0Q8M-AM62iXGL5SCIs2M2h8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/dGlrdG9rLXByb2Zp/bGUtcGljdHVyZS10/ZW1wbGF0ZV83NDIx/NzMtNDQ4Mi5qcGc_/c2VtdD1haXNfaHli/cmlkJnc9NzQwJnE9/ODA",
    },
    about: {
      type: String,
      default: "This is a default value.",
    },
    skills: {
      type: [String],
      maxLength: 10,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign(
    { _id: user._id },
    "DEV@Tinder$790",
    {
      expiresIn: "7d",
    }
  );

  return token;
};

userSchema.methods.validatePassword =
  async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      passwordHash
    );

    return isPasswordValid;
  };

module.exports = mongoose.model(
  "User",
  userSchema
);
