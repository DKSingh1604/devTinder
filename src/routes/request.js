const express = require("express");
const requestRouter = express.Router();
const {
  userAuth,
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//POST - send connection API
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const firstName = req.user.firstName;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //Status validation
      const allowedStatus = [
        "ignored",
        "interested",
      ];
      if (!allowedStatus.includes(status)) {
        return res.json({
          message: `${status} is an invalid status type.`,
        });
      }

      const toUserExists = await User.findById(
        toUserId
      );
      if (!toUserExists) {
        return res.status(400).json({
          message: `Can't find user with that id.`,
        });
      }

      //If there is an existing connection request
      const existingConnectionRequest =
        await ConnectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            {
              fromUserId: toUserId,
              toUserId: fromUserId,
            },
          ],
        });
      if (existingConnectionRequest) {
        return res.status(400).send({
          message:
            "Connection request already sent!",
        });
      }

      //fetch the firstName from toUserId
      const toUserfirstName =
        toUserExists.firstName;
      const toUserlastName =
        toUserExists.lastName;

      const connectionRequest =
        new ConnectionRequest({
          fromUserId,
          toUserId,
          status,
        });

      const data = await connectionRequest.save();

      res.json({
        message: `${firstName}'s connection request was sent to ${toUserfirstName} ${toUserlastName}.`,
        data: data,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

//POST - accept/reject connection API
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //Validating the status
      const allowedStatus = [
        "accepted",
        "rejected",
      ];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid request status!",
        });
      }

      const connectionRequest =
        await ConnectionRequest.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        });

      if (!connectionRequest) {
        return res.status(404).json({
          message:
            "Connection Request is not valid!",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Connection Request ${status}.`,
        data,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
