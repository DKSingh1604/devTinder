const express = require("express");
const {
  userAuth,
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

//GET all the received pending connection requests for the logged in user
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
        }).populate(
          "fromUserId",
          "firstName lastName photoUrl age about gender skills"
        );

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

//GET - all the sent pending connection requests for the logged in user
userRouter.get(
  "/user/requests/sent",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests =
        await ConnectionRequest.find({
          fromUserId: loggedInUser._id,
          status: "interested",
        }).populate(
          "toUserId",
          "firstName lastName photoUrl age about gender skills"
        );

      res.json({
        message: `${loggedInUser.firstName}, your received requests are fetched successfully!`,
        data: connectionRequests,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

//GET - the connections of the user
userRouter.get(
  "/user/connections",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests =
        await ConnectionRequest.find({
          $or: [
            {
              toUserId: loggedInUser._id,
              status: "accepted",
            },
            {
              fromUserId: loggedInUser._id,
              status: "accepted",
            },
          ],
        })
          .populate(
            "fromUserId",
            "firstName lastName"
          )
          .populate(
            "toUserId",
            "firstName lastName"
          );

      const data = connectionRequests.map(
        (row) => {
          if (
            row.fromUserId._id.toString() ===
            loggedInUser._id.toString()
          ) {
            return row.toUserId;
          }
          return row.fromUserId;
        }
      );

      res.json({
        message: "Requests fetched successfully!",
        data: data,
      });
    } catch (error) {
      res
        .status(400)
        .send({ message: error.message });
    }
  }
);

module.exports = userRouter;
