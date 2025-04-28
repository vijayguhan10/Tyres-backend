const express = require("express");
const route = express.Router();
const appointmentRoutes = require("./Appointment.route");
const orderRoutes = require("./Order.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");

route.use("/", authenticateJWT, rolecheck("client"), appointmentRoutes);
route.use("/order-client", authenticateJWT, rolecheck("client"), orderRoutes);

module.exports = route;
