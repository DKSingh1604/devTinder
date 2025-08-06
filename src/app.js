const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //Creating a new instance of the userModel
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "vk@gmail.com",
    password: "lolololol",
  });

  try {
    await user.save();
    res.send("User has been addded to the DB.");
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .send("Error saving the user.");
  }
});

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
