const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// get all pending req of login user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const logiUser = req.user;
    const connenctionRequests = await ConnectionRequest.find({
      toUserId: logiUser._id,
      status: "intrested",
      // }).populate("fromUserId", ["firstName", "lastName"]); //"firstName", "lastName" from req user
    }).populate("fromUserId", "firstName lastName");
    res.json({ message: "user requests are ", data: connenctionRequests });
  } catch (error) {
    res.status(400).send("error in pending req " + error.message);
  }
});

module.exports = userRouter;
