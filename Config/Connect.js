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

// const authenticate = (age) => {
//   return new Promise((resolve, reject) => {
//     if (age > 5) {
//       setTimeout(() => {
//         resolve("age is correct to apply adhaar");
//       }, 5000);
//     }
//   });
// };
// const Returnresponse = (obj) => {
//   return new Promise((resolve, reject) => {
//     if (obj.criteria > 15) {
//       setTimeout(() => {
//         resolve("Resolved criteria");
//       }, 3000);
//     }
//   });
// };
// authenticate(6)
//   .then((msg) => {
//     console.log(msg);
//     return Returnresponse({ criteria: 66 });
//   })
//   .then((msg) => {
//     console.log(msg);
//   });
