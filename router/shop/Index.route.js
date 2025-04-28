const express = require("express");
const route = express.Router();
const Address = require("./Address.route");
const ordertyres = require("./Request.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
route.use("", authenticateJWT, rolecheck("fitment-center"), Address);
route.use(
  "/orders",
  authenticateJWT,
  rolecheck("fitment-center"),
  ordertyres
);
module.exports = route;
