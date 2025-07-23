const express = require("express");
const User = require("./models/user");
const connectDb = require("./config/database");
const bcrypt = require("bcrypt");
const valodateSignupData = require("./utils/validation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
// adding users
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    valodateSignupData(req);
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

// gettings users
app.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      console.log("no user in database");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("error in getting user from DB  " + error.message);
  }
});

// login users
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid crendential emails.... ");
    }
    const isPawordValid = await bcrypt.compare(password, user.password);
    if (isPawordValid) {
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER11", {
        expiresIn: "0d", // 0d,1h,100d
      });
      res.cookie("token", token);
      res.send("User login successfull..");
    } else {
      throw new Error("Invalid crendentials password .... ");
    }
  } catch (error) {
    res.status(400).send("error in getting user from DB  " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

//  database connecting
const PORT = 3000;
connectDb()
  .then(() => {
    console.log("database is connecting succesfully 👍");
    app.listen(PORT, () => {
      console.log("server is running in port 30000 ⬆️");
    });
  })
  .catch(() => {
    console.log("database is not connecting 🤦‍♂️");
  });
