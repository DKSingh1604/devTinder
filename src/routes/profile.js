const express = require("express");
const profileRouter = express.Router();
const {
  userAuth,
} = require("../middlewares/auth");
const {
  validateEditProfileData,
} = require("../utils/validation");

//GET - PROFILE VIEW API
profileRouter.get(
  "/profile/view",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      console.log(
        "profile route req.user:",
        user
      );
      if (!user) {
        return res
          .status(404)
          .send("User not found!");
      }

      const { firstName, lastName } = user;

      // console.log(user);

      // res.send("Getting cookies...");
      res.send(
        `The cookie you have is of ${firstName} ${lastName}`
      );
    } catch (error) {
      res.status(400).send(`ERROR: ${error}`);
    }
  }
);

//PATCH - PROFILE EDIT API
profileRouter.patch(
  "/profile/edit",
  userAuth,
  async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request!");
      }

      const loggedInUser = req.user;

      Object.keys(req.body).forEach(
        (key) =>
          (loggedInUser[key] = req.body[key])
      );

      await loggedInUser.save();

      //   res.send(
      //     `Hi ${loggedInUser.firstName}, your profile looks better now!`
      //   );
      res.json({
        message: `Hi ${loggedInUser.firstName}, your profile looks better now!`,
        data: loggedInUser,
      });
    } catch (error) {
      res
        .status(400)
        .send("ERROR: " + error.message);
    }
  }
);

module.exports = profileRouter;
