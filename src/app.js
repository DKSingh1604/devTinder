const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const {
  userAuth,
} = require("./middlewares/auth");
const {
  validateSignUpData,
  validateLoginData,
} = require("./utils/validation");

//IF YOU ADD A VALIDATION HERE, THAT'S CALLED A API LEVEL VALIDAITON

app.use(express.json()); // a middleware reads th json object, converts into a JS object and then it adds it back to req.body
app.use(cookieParser());

//Signing user up
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

      res.send("Login Succesful!!");
    } else {
      throw new Error("Password is not correct!");
    }
  } catch (error) {
    res
      .status(400)
      .send(`Error logging in: ${error}`);
  }
});

//GET PROFILE
app.get(
  "/profile",
  userAuth,
  async (req, res) => {
    try {
      const user = await req.user;

      if (!user) {
        return res
          .status(404)
          .send("User not found!");
      }

      const { firstName, lastName } = user;

      // console.log(user);

      // res.send("Getting cookies...");
      res.send(
        `The cookie you have is of ${firstName} ${lastName}`
      );
    } catch (error) {
      res.status(400).send(`ERROR: ${error}`);
    }
  }
);

//SEND CONNECTION REQUEST
app.post(
  "/sendConnectionRequest",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      //logic of sending a connection request.....
      console.log(
        "Sending a connection request."
      );

      res.send(
        `${user.firstName} sent the connection request.`
      );
    } catch (error) {
      res.status(400).send(`ERROR: ${error}`);
    }
  }
);

connectDB()
  .then(() => {
    console.log(
      "Database connected successfully."
    );
    app.listen(7777, () => {
      console.log(
        "Server port 7777 pe sun rh h......."
      );
    });
  })
  .catch((err) => {
    console.error("Couldn't connect to the DB.");
  });

//Right way to start the server and DB is to first connect your project to the DB, if it is successful, then connect the server i.e call app.listen().
