const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../../../devTinder/src/utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid data for profile update");
    } else {
      const loginUser = req.user;
      Object.keys(req.body).forEach((key) => {
        loginUser[key] = req.body[key];
      });
      await loginUser.save();
      res.send({ message: "user updated successfully" });
    }
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

module.exports = profileRouter;
