const express = require("express");
const route = express.Router();
const appointmentRoutes = require("./Appointment.route");
const orderRoutes = require("./Order.route");
const addVehicleRoutes = require("./AddVehicle.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");
const clientcarwashdataRoutes = require("./Clientcarwashdata.route");

route.use(
  "/appointment",
  authenticateJWT,
  // rolecheck("client"),
  appointmentRoutes
);
route.use("/order-client", authenticateJWT, rolecheck("client"), orderRoutes);
route.use("/vehicle", authenticateJWT, rolecheck("client"), addVehicleRoutes);
route.use("/clientcarwashdata", authenticateJWT, rolecheck("client"), clientcarwashdataRoutes);
module.exports = route;
