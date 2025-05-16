const TyreRequestShop = require("../../Models/shop/RequestTyres");
const ClientAppointments = require("../../Models/client/Appointment");
const TyreRequest = require("../../Models/shop/RequestTyres");
const Appointment = require("../../Models/client/Appointment");
const mongoose = require("mongoose");

// Get all Tyre Requests with populated Shop, User, and Tyre details
const getAllTyreRequestsReport = async (req, res) => {
  try {
    // First check if all required models are registered
    if (!mongoose.modelNames().includes("addtyre")) {
      throw new Error("addtyres model is not registered");
    }

    const tyreRequests = await TyreRequest.find()
      .populate("userId", "name email")
      .populate("ShopId", "name region businessAddress")
      .populate({
        path: "specification.tyreId",
        model: "addtyre",
      });

    res.status(200).json({ tyreRequests });
  } catch (error) {
    console.error("Error in getAllTyreRequestsReport:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: "Please ensure all required models are properly registered",
    });
  }
};

const getAllAppointmentsReport = async (req, res) => {
  try {
    if (!mongoose.modelNames().includes("addtyre")) {
      throw new Error("addtyre model is not registered");
    }

    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .populate("addressId")
      .populate({
        path: "orderinfo.orderItems.tyre",
        select: "brand model", // only return brand and model
        model: "addtyre",
      });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error in getAllAppointmentsReport:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: "Please ensure all required models are properly registered",
    });
  }
};

// Example analytics: Count of Tyre Requests by status
const getTyreRequestStatusAnalytics = async (req, res) => {
  try {
    const statusCounts = await TyreRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.status(200).json({ statusCounts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Example analytics: Appointments per day
const getAppointmentsPerDayAnalytics = async (req, res) => {
  try {
    const perDay = await Appointment.aggregate([
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({ perDay });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllTyreRequestsReport,
  getAllAppointmentsReport,
  getTyreRequestStatusAnalytics,
  getAppointmentsPerDayAnalytics,
};
