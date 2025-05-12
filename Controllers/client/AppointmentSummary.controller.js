const mongoose = require("mongoose");
const Appointment = require("../../Models/client/Appointment");

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const populateOptions = [
      {
        path: "userId",
        select: "-password",
      },
      {
        path: "addressId",
      },
      {
        path: "orderinfo",
        populate: {
          path: "orderItems",
          populate: [
            { path: "tyre" },
            {
              path: "vehicleId",
              select:
                "registrationNumber vehicleType vehicleModel servicesDone",
            },
          ],
        },
      },
    ];

    const upcomingAppointments = await Appointment.find({
      userId,
      orderstatus: ["pending", "Approved"]
    })
      .populate(populateOptions)
      .lean();

    const completedAppointments = await Appointment.find({
      userId,
      orderstatus: "completed",
    })
      .populate(populateOptions)
      .lean();

    const paymentpending = await Appointment.find({
      userId,
      paymentStatus: "Unpaid",
    })
      .populate(populateOptions)
      .lean();

    const issueAppointments = await Appointment.find({
      userId,
      status: "issues",
    })
      .populate(populateOptions)
      .lean();

    // Use toJSON to ensure proper serialization
    const response = {
      success: true,
      upcoming: JSON.parse(JSON.stringify(upcomingAppointments)),
      completed: JSON.parse(JSON.stringify(completedAppointments)),
      paymentpending: JSON.parse(JSON.stringify(paymentpending)),
      issues: JSON.parse(JSON.stringify(issueAppointments)),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
};
const AdminSummary = async (req, res) => {
  try {
    const populateOptions = [
      {
        path: "userId",
        select: "-password",
      },
      {
        path: "addressId",
      },
      {
        path: "orderinfo",
        populate: {
          path: "orderItems",
          populate: [
            { path: "tyre" },
            {
              path: "vehicleId",
              select:
                "registrationNumber vehicleType vehicleModel servicesDone",
            },
          ],
        },
      },
    ];

    // Remove userId filter — fetch ALL data
    const upcomingAppointments = await Appointment.find({
      orderstatus: "pending",
    })
      .populate(populateOptions)
      .lean();

    const completedAppointments = await Appointment.find({
      orderstatus: "Approved",
    })
      .populate(populateOptions)
      .lean();

    const paymentpending = await Appointment.find({
      paymentStatus: "Unpaid",
    })
      .populate(populateOptions)
      .lean();

    const issueAppointments = await Appointment.find({
      orderStatus: "issue",
    })
      .populate(populateOptions)
      .lean();

    const response = {
      success: true,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
      paymentpending: paymentpending,
      issues: issueAppointments,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching admin appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
};

module.exports = { getUserAppointments, AdminSummary };
