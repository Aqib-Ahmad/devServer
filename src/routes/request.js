const express = require("express");
const requestRouter = express.Router();

requestRouter.get("/connectionrequest", async (req, res) => {
  res.send(user + "connection request");
});

module.exports = requestRouter;
