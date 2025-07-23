const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://namastenode:namastenode@namastenode.z2slvnl.mongodb.net/devtinder"
  );
};

module.exports = connectDb;
