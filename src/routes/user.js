const express = require("express");
const {
  userAuth,
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

//GET - all the received pending connection requests for the logged in user
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

//GET - the user feed
userRouter.get(
  "/feed",
  userAuth,
  async (req, res) => {
    try {
      //for the current user, show all the people who are
      //-> not marked as ignored/interested or accepted/rejected
      //-> not the user himself

      const loggedInUser = req.user;
      //params -> :status        query -> ?page=1
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;

      //find all the connection requests (sent + received)
      const connectionRequests =
        await ConnectionRequest.find({
          $or: [
            { fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id },
          ],
        }).select("fromUserId toUserId");

      const hideUserFromFeed = new Set();

      connectionRequests.forEach((req) => {
        hideUserFromFeed.add(
          req.fromUserId.toString()
        );
        hideUserFromFeed.add(
          req.toUserId.toString()
        );
      });

      const user = await User.find({
        $and: [
          {
            _id: {
              $nin: Array.from(hideUserFromFeed),
            },
          },
          {
            _id: {
              $ne: loggedInUser._id,
            },
          },
        ],
      })
        .select(
          "firstName lastName age gender photoUrl skills about"
        )
        .skip(skip)
        .limit(limit);

      if (!user) {
        res.json({ message: "No user found!" });
      }

      res.json({
        message: `You have ${user.length} users in your feed.`,
        data: user,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);
module.exports = userRouter;
