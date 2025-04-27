const express = require("express");
const {
  createTyreInfo,
  getTyreInfos,
  getTyreInfoById,
  updateTyreInfo,
  deleteTyreInfo,
} = require("../../Controllers/client/OrderTyre.controller");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../../Controllers/client/Appointment.controller");
const router = express.Router();
const { authenticateJWT } = require("../../Controllers/User.controller");
router.post("/order-client/ordertyre", authenticateJWT, createTyreInfo);
router.get("/order-client/orderinfo", authenticateJWT, getTyreInfos);
router.get("/order-client/orderinfo/:id", authenticateJWT, getTyreInfoById);
router.put("/order-client/orderinfo/:id", authenticateJWT, updateTyreInfo);
router.delete("/order-client/orderinfo/:id", authenticateJWT, deleteTyreInfo);
router.post("/bookappointment", authenticateJWT, createAppointment);
router.get("/singleappointment", authenticateJWT, getAppointments);
router.get("/appointments/:id", authenticateJWT, getAppointmentById);
router.put("/appointments/:id", authenticateJWT, updateAppointment);
router.delete("/appointments/:id", authenticateJWT, deleteAppointment);
module.exports = router;
