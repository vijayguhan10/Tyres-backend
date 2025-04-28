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

router.post("/bookappointment", createAppointment);
router.get("/singleappointment", getAppointments);
router.get("/appointments/:id", getAppointmentById);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);
module.exports = router;
