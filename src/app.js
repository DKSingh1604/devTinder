const express = require("express");

//instance of an express js application
const app = express();

app.set;

//request handler function
app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/profile", (req, res) => {
  res.send("Hello from the profile!");
});

app.use("/dashboard", (req, res) => {
  res.send("Hello from the dasboard!");
});

//port - 30000
app.listen(3000, () => {
  console.log(
    "Server is listening on port 3000......"
  );
});
