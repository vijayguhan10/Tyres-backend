const express = require("express");
const AddtyreRoutes = require("./Addtyre.route");
const MappingRoutes = require("./AssignOrder.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
const AssignShopsInfo = require("./Distance.route");
const ShopSummary = require("./ShopSummary.route");
const TyreRequests = require("./TyreRequests.route");
const Carwash = require("./Carwash.route");
const report = require("./Report.route");
const route = express.Router();
console.log("Index route");
route.use("/addtyre", authenticateJWT, AddtyreRoutes);
route.use("/mapping", authenticateJWT, rolecheck("admin"), MappingRoutes);
route.use("/shopsummary", authenticateJWT, rolecheck("admin"), ShopSummary);
route.use(
  "/assignshopinfo",
  authenticateJWT,
  rolecheck("admin"),
  AssignShopsInfo
);
route.use("/tyrerequests", authenticateJWT, rolecheck("admin"), TyreRequests);
route.use("/report", authenticateJWT, rolecheck("admin"), report);
route.use("/carwash", authenticateJWT, rolecheck("admin"), Carwash);
module.exports = route;
