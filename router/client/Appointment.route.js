const express = require("express");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updatePaymentStatus,
} = require("../../Controllers/client/Appointment.controller");
const router = express.Router();

router.post("/bookappointment", createAppointment);
router.get("/singleappointment", getAppointments);
router.get("/appointments/:id", getAppointmentById);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);
router.patch("/appointments/:id/payment", updatePaymentStatus);
module.exports = router;
