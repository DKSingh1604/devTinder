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

// app.get(
//   "/user",
//   (req, res, next) => {
//     //route handler 1
//     console.log("Route handled for 1");
//     next();
//     // res.send("API route handled for 1");
//   },
//   (req, res) => {
//     //route handler 2
//     console.log("Route handled for 2");
//     res.send("API route handled for 2");
//   }
// );

//if we add '?' in front of a char, that char becomes optional in route
//if we put '+' in front of a char, that char can be types multiple times in the string of the route
//REGULAR Expressions work in the routes

//port - 30000
// app.listen(3000, () => {
//   console.log(
//     "Server is listening on port 3000......"
//   );
// });

/*
next() is a function given to us by express that is used to pass control to the next middleware function in the stack.

should not use res.send() and then next() together in the same route handler, as it will lead to an error because the response has already been sent to the client.
*/

// app.get("/user", (req, res, next) => {
//   //route handler 2
//   console.log("Route handled for 2");
//   // next();
//   res.send("API route handled for 2");
// });

// app.get("/user", (req, res, next) => {
//   //route handler 1
//   console.log("Route handled for 1");
//   next();
//   // res.send("API route handled for 1");
// });

//port - 30000
// app.listen(3000, () => {
//   console.log(
//     "Server is listening on port 3000......"
//   );
// });

/*
                          M I D D L E W A R E S

These functions that are put in the get methods for route handling are called middleware functions.

When a request is received at the server, the express looks for that particular route in the chained functions above. From the function function till the function where the route is acually handled and response is sent back to the server, all those are called middleware functions. And the last one is called the route handler.

If there is a app.use() with a next() function -> GLobal Middleware
If ther is app.get() etc, function with a next() -> Route-specific middlewares
The skipped middlewares are called Unused middlewares.


MIDDLEWARES are used to check the AUTH
*/

/*                        AUTHENTICATION
Now we will have to check whether the person who is hitting the api call is authorised user or not. Not everyone should be able to get a response from the api call.

We check whether that person has the auth token or not.
*/

// app.get("/admin/getAllData", (req, res) => {
//   //logic to check the auth of user
//   const token = "xyzada";
//   const isAdminAuthorised = token === "xyz";
//   if (isAdminAuthorised) {
//     res.send("All data sent");
//   } else {
//     res.status(401).send("Unauthorised access");
//   }
// });

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("The user is deleted.");
// });

//Instead of the above code we can write
// const {
//   adminAuth,
//   userAuth,
// } = require("./middlewares/auth");

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All data sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("The user is deleted.");
// });

// app.get("/user", userAuth, (req, res) => {
//   res.send("User route is reached.");
// });

//Now instead of wirting logic inside every function we just create a middleware logic which will always be reached.
//For that we will put app.use() on top of all middlewares.  But the app.use() will ask for auth for all kinds of request(get, post....).
//If we want auth check only for get request, we will use app.get()
//same for other type of requests.

//-------------------------------------------------------
//ERROR CATCHING - either try-catch or err inside app.use("/")
//try catch better way always
app.get("/getUserData", (req, res) => {
  throw new Error("Random Error");
  res.send("User Data Sent");
});

//wild card error handling
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(3000, () => {
  console.log(
    "Server port 3000 pe sun rha hai....."
  );
});
