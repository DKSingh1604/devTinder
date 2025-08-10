const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("./utils/validation");

//IF YOU ADD A VALIDATION HERE, THAT'S CALLED A API LEVEL VALIDAITON

app.use(express.json()); // a middleware reads th json object, converts into a JS object and then it adds it back to req.body

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

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (isPasswordValid) {
      res.send("Login Succesfull!!");
    } else {
      throw new Error("Password is not correct!");
    }
  } catch (error) {
    res
      .status(400)
      .send(`Error logging in: ${error}`);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({
      emailId: userEmail,
    });
    if (user.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(user);
    }
    // res.send(user);
  } catch (error) {
    console.log(error);

    res.status(400).send("Something went wrong!");
  }
});

//feed API - GET / feed - get all the users from the db
app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find({});
    res.send(feed);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//delete a user by a property
app.delete("/user", async (req, res) => {
  const firstName = req.body.firstName;

  try {
    const user = await User.deleteOne({
      firstName,
    });
    res.send("User deleted successfully!");
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong!");
  }
});

//delete the user by Id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(
      userId
    );

    res.send("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong!");
  }
});

//update the data in the db with findByIdAndUpdate()
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    //to check if the field the user is trying to update is even allowed to update or not
    const isUpdateAllowed = Object.keys(
      data
    ).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    //validation for duplicate skills
    if (data?.skills) {
      const skillsSet = new Set(
        data.skills.map((s) => s.toLowerCase())
      );
      if (skillsSet.size !== data.skills.length) {
        throw new Error(
          "Duplicate skills not allowed!"
        );
      }
      //validation on skills length
      if (data?.skills.length > 10) {
        throw new Error(
          "Can't add more than 10 skills."
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      data,
      { returnDocument: "after" }
    );
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .send("User not found!");
    }

    //any data which you are trying to update through patch, which is not in the user schema, won't be updated
    res.send("User updated succesfully!");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(`Update Failed: ${error.message}`);
  }
});

//use only one at a time either findByIdAndUpdate or findOneAndUpdate

//update the data in the db with findOneAndUpdate()
// app.patch("/user", async (req, res) => {
//   // const emailId = req.body.emailId;
//   const firstName = req.body.firstName;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "firstName",
//       "userId",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//     ];

//     const isUpdateAllowed = Object.keys(
//       data
//     ).every((k) => ALLOWED_UPDATES.includes(k));

//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed!");
//     }

//     const user = await User.findOneAndUpdate(
//       { firstName },
//       data,
//       {
//         returnDocument: "after",
//         runValidators: true,
//       }
//     );
//     console.log(user);

//     if (!user) {
//       return res
//         .status(404)
//         .send("User not found!");
//     }

//     // just like findByIdAndUpdate, only fields in the schema will be updated
//     res.send("User updated succesfully!");
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).send(error.message);
//   }
// });

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
