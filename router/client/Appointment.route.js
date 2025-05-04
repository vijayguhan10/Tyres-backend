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
const {getUserAppointments}=require("../../Controllers/client/AppointmentSummary.controller")
const router = express.Router();
const { authenticateJWT } = require("../../Controllers/User.controller");
router.get("/appointments/summary", getUserAppointments);

router.post("/bookappointment", authenticateJWT, createAppointment);
router.get("/singleappointment", authenticateJWT, getAppointments);
router.get("/appointments/:id", authenticateJWT, getAppointmentById);
router.put("/appointments/:id", authenticateJWT, updateAppointment);
router.delete("/appointments/:id", authenticateJWT, deleteAppointment);
module.exports = router;
