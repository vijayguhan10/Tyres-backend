const express = require("express");
const route = express.Router();
const Address = require("./Shop.route");
const ordertyres = require("./OrderTyres.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
route.use("/shops", authenticateJWT, Address);
route.use(
  "/shops/tyres",
  authenticateJWT,
  rolecheck("fitment-center"),
  ordertyres
);
module.exports = route;
