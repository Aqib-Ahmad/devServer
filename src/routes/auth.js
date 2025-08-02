const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const vailidateSignupData = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    vailidateSignupData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added ");
  } catch (error) {
    res.status(400).send("Error in signup :" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid crendential emails.... ");
    }
    const isPawordValid = await user.validatePassword(password);
    if (isPawordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.send("User login successfull..");
    } else {
      throw new Error("Invalid crendentials password .... ");
    }
  } catch (error) {
    res.status(400).send("error in getting user from DB  " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User logout successfull..");
});

authRouter.patch("/resetpassword", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found with this emailId");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Reset password successfull..");
  } catch (error) {
    res.status(400).send("Error in resetting password: " + error.message);
  }
});
module.exports = authRouter;
