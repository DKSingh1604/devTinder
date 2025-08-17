const validator = require("validator");
const express = require("express");
const forgotRouter = express.Router();
const User = require("../models/user");
const crypto = require("crypto");
const { send } = require("process");
const bcrypt = require("bcrypt");

//POST - FORGET PASSWORD API
forgotRouter.post(
  "/forgotPassword",
  async (req, res) => {
    try {
      const { emailId } = req.body;
      const user = await User.findOne({
        emailId,
      });

      if (!user) {
        throw new Error("Email not registered!");
      }

      //generating a reset token
      const resetToken = crypto
        .randomBytes(32)
        .toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires =
        Date.now() + 3600000; //1 hour

      await user.save();

      // In real app, send email with reset link containing the token
      // For demo, just return the token
      res.json({
        message:
          "Password reset link sent to your email.",
        resetToken,
      });
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

//POST - RESET PASSOWRD API
forgotRouter.post(
  "/resetPassword",
  async (req, res) => {
    try {
      const { resetToken, newPassword } =
        req.body;
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user)
        throw new Error(
          "Invalid or expired token."
        );

      //validating the new password
      if (
        !validator.isStrongPassword(newPassword)
      ) {
        throw new Error(
          "The Password is not strong!"
        );
      }

      const passwordHash = await bcrypt.hash(
        newPassword,
        10
      );

      user.password = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.send(
        "Password has been reset successfully."
      );
    } catch (error) {
      res
        .status(400)
        .send(`ERROR: ${error.message}`);
    }
  }
);

module.exports = forgotRouter;
