const express = require("express");

//instance of an express js application
const app = express();

//Order of how routes are written matter

//request handler function
// app.use("/", (req, res) => {
//   res.send("Hello from the server!");
// }); //if
// //  this route is alwaays written first, the request will be sent to this route only. It wont check the other routes like '/hello' etc.

// app.get("/user", (req, res) => {
//   res.send({
//     firstName: "Dev Karan",
//     lastName: "Singh",
//   });
// });
//request handler function
// app.use("/test", (req, res) => {
//   res.send("Hello from the test!");
// });

// app.use("/profile", (req, res) => {
//   res.send("Hello from the profile!");
// });

// app.use("/dashboard", (req, res) => {
//   res.send("Hello from the dasboard!");
// });

//Advanced concept
app.get("/abc", (req, res) => {
  res.send({
    firstName: "Gary",
    lastName: "Singh",
  });
});

app.use(
  "/user",
  (req, res) => {
    //route handler 1
    console.log("Route handled for 1");
    res.send("API route handled for 1");
  },
  (req, res) => {
    //route handler 2
    console.log("Route handled for 2");
    res.send("API route handled for 2");
  }
);

//if we add '?' in front of a char, that char becomes optional in route
//if we put '+' in front of a char, that char can be types multiple times in the string of the route
//REGULAR Expressions work in the routes

//port - 30000
app.listen(3000, () => {
  console.log(
    "Server is listening on port 3000......"
  );
});
