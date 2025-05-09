const express = require("express");
const AddtyreRoutes = require("./Addtyre.route");
const MappingRoutes = require("./Mapping.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
const AssignShopsInfo=require("./AssignShops.route")
const route = express.Router();

route.use("/addtyre", authenticateJWT, AddtyreRoutes);
route.use("/mapping", authenticateJWT, rolecheck("admin"), MappingRoutes);

route.use("/assignshopinfo", authenticateJWT, rolecheck("admin"), AssignShopsInfo);
module.exports = route;
