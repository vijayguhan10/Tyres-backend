const mongoose = require("mongoose");
const Appointment = require("../../Models/client/Appointment");

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const upcomingAppointments = await Appointment.find({
      userId,
      status: "Pending",
    }).populate("userId addressId orderinfo");

    const completedAppointments = await Appointment.find({
      userId,
      status: "Completed",
    }).populate("userId addressId orderinfo");

    const issueAppointments = await Appointment.find({
      userId,
      status: "issues",
    }).populate("userId addressId orderinfo");

    return res.status(200).json({
      success: true,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
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

module.exports = {getUserAppointments};
