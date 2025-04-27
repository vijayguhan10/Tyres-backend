const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ConnectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
module.exports = ConnectDb;
