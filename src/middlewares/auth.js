const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //Read the token from the request cookies
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid!");
    }

    //validate the token
    const decodedObj = await jwt.verify(
      token,
      "DEV@Tinder$790"
    );

    //find the user
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(400)
      .send(`ERROR: ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
