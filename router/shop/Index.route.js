const express = require("express");
const route = express.Router();
const Address = require("./Shop.route");
const ordertyres = require("./OrderTyres.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
const Owninventory = require("./Owninventory.route");
const Owncustomers = require("./Owncustomers.route");
route.use("/shops", authenticateJWT, Address);
route.use(
  "/shops/tyres",
  authenticateJWT,
  rolecheck("fitment-center"),
  ordertyres
);
route.use(
  "/shops/owninventory",
  authenticateJWT,
  rolecheck("fitment-center"),
  Owninventory
);
route.use(
  "/shops/owncustomers",
  authenticateJWT,
  rolecheck("fitment-center"),
  Owncustomers
);
module.exports = route;
