const express = require("express");
const {
  userAuth,
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

//GET all the pending connection request for the logged in user
userRouter.get(
  "/user/requests/received",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests =
        await ConnectionRequest.find({
          toUserId: loggedInUser._id,
          status: "interested",
        });

      res.json({
        message: `Your received requests are fetched successfully!`,
        data: connectionRequests,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

module.exports = userRouter;
