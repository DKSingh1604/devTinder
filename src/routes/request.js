const express = require("express");
const requestRouter = express.Router();
const {
  userAuth,
} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//send connection API
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
        message: `Connection request was sent to ${toUserfirstName} ${toUserlastName}.`,
        data: data,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
