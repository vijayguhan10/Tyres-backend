const express = require("express");
const route = express.Router();
const appointmentRoutes = require("./Appointment.route");
const orderRoutes = require("./Order.route");
route.use("/", appointmentRoutes);  
route.use("/order-client", orderRoutes);  

module.exports = route;
