const express = require("express");
const AddtyreRoutes = require("./Addtyre.route");
const MappingRoutes = require("./Mapping.route");
const AssignShops=require("./AssignOrders.route")
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");

const route = express.Router();

route.use("/addtyre", authenticateJWT, rolecheck("admin"), AddtyreRoutes);
route.use("/mapping", authenticateJWT, rolecheck("admin"), MappingRoutes);
route.use("/assign", authenticateJWT, rolecheck("admin"), AssignShops);

module.exports = route;
