const express = require("express");
const User = require("./models/user");
const connectDb = require("./config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//  database connecting
const PORT = 5000;
connectDb()
  .then(() => {
    console.log("database is connecting succesfully 👍");
    app.listen(PORT, () => {
      console.log(` server is running in port⬆️  ${PORT} `);
    });
  })
  .catch(() => {
    console.log("database is not connecting 🤦‍♂️");
  });
