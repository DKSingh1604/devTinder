const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

//IF YOU ADD A VALIDATION IN APP.JS, THAT'S CALLED AN API LEVEL VALIDAITON

app.use(express.json()); // a middleware reads the json object, converts into a JS object and then it adds it back to req.body
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
