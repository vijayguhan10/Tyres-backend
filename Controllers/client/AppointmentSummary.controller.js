const mongoose = require("mongoose");
const Appointment = require("../../Models/client/Appointment");
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const upcomingAppointments = await Appointment.find({
      userId,
      orderstatus: "pending",
    })

    const completedAppointments = await Appointment.find({
      userId,
      orderstatus: "completed",
    })

    const paymentpending = await Appointment.find({
      userId,
      paymentStatus: "Unpaid",
    })

    const issueAppointments = await Appointment.find({
      userId,
      status: "issues",
    })

    return res.status(200).json({
      success: true,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
      paymentpending,
      issues: issueAppointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
};

module.exports = { getUserAppointments };
