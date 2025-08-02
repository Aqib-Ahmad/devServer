const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      // intrested or ignored
      const allowedStatusType = ["intrested", "ignored"];
      if (!allowedStatusType.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      // checking the user exists or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: " connection request already exists" });
      }

      // checking user is in Db or not
      const user = await User.findById(toUserId);
      if (!user) {
        return res.json({ message: "user is not in database" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({ message: "connection request send successfully", data: data });
    } catch (error) {
      res.status(400).send("ERROR " + error.message);
    }
  }
);

module.exports = requestRouter;
