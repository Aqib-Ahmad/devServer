const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/devtinder"
    // "mongodb+srv://namastenode:namastenode@namastenode.z2slvnl.mongodb.net/devtinder"
  );
};

module.exports = connectDb;
