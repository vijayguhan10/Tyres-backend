const express = require("express");
const route = express.Router();
const appointmentRoutes = require("./Appointment.route");
const orderRoutes = require("./Order.route");
const addVehicleRoutes = require("./AddVehicle.route");
const { authenticateJWT } = require("../../Controllers/User.controller");
const { rolecheck } = require("../../Utils/Role");

route.use("/appointment", authenticateJWT, rolecheck("admin"), appointmentRoutes);
route.use("/order-client", authenticateJWT, rolecheck("admin"), orderRoutes);
route.use("/vehicle", authenticateJWT, rolecheck("admin"), addVehicleRoutes);

module.exports = route;
