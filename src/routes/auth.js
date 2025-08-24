const express = require("express");
const authRouter = express.Router();

const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

//Signup API
authRouter.post("/signup", async (req, res) => {
  //sign up api format
  //1- validate data
  //2- encrypt password
  //3- save the data

  try {
    //validation of data
    validateSignUpData(req);

    //Encrypting the password
    const {
      firstName,
      lastName,
      emailId,
      password,
    } = req.body;
    const data = req.body;
    const passwordHash = await bcrypt.hash(
      password,
      10
    );
    console.log(passwordHash);

    //Creating a new instance of the userModel
    //this is a Javascript object
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    console.log(
      `User has been addded to the DB: ${user}`
    );

    res.send("User has been addded to the DB.");
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .send(
        `Error saving the user: ${error.message}`
      );
  }
});

//Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //validation of data
    validateLoginData(req);

    const user = await User.findOne({
      emailId: emailId,
    });

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid =
      await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT token
      const token = await user.getJWT();
      // console.log(token);

      //Add the token to cookie and send
      res.cookie("token", token);

      res.send(
        `Login successful as ${user.firstName}!`
      );
    } else {
      throw new Error("Password is not correct!");
    }
  } catch (error) {
    res
      .status(400)
      .send(`Error logging in: ${error}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Successful");
});

module.exports = authRouter;
