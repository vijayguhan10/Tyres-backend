const express = require("express");
const route = express.Router();
const Address = require("./Shop.route");
const ordertyres = require("../admin/AssignOrder.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
route.use("/shops", authenticateJWT, rolecheck("fitment-center"), Address);
route.use(
  "/ordertyres",
  authenticateJWT,
  // rolecheck("fitment-center"),
  ordertyres
);
module.exports = route;
