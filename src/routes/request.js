const express = require("express");
const requestRouter = express.Router();
const {
  userAuth,
} = require("../middlewares/auth");

//send connection API
requestRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      //logic of sending a connection request.....
      console.log(
        "Sending a connection request."
      );

      res.send(
        `${user.firstName} sent the connection request.`
      );
    } catch (error) {
      res.status(400).send(`ERROR: ${error}`);
    }
  }
);

module.exports = requestRouter;
