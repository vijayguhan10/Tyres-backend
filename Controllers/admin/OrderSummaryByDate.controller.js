const mongoose = require("mongoose");
const Appointment = require("../../Models/client/Appointment");
const ClientOrder = require("../../Models/client/OrderTyre");
const Shop = require("../../Models/shop/Shop");
const User = require("../../Models/User");
const AddVehicle = require("../../Models/client/AddVehicle");

const getOrderSummaryByDateForMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }

    // Format date range
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch all appointments in the given date range
    const appointments = await Appointment.find({
      date: {
        $gte: startDate.toISOString().split("T")[0],
        $lt: endDate.toISOString().split("T")[0],
      },
      orderstatus: "pending",
    })
      .populate("userId", "name")
      .populate("orderinfo");

    // Fetch all shops
    const shops = await Shop.find();

    const summary = [];

    for (const appointment of appointments) {
      const order = appointment.orderinfo;

      if (!order) continue;

      const user = appointment.userId;
      const vehicles = [];

      for (const item of order.orderItems) {
        if (item.vehicleId) {
          const vehicle = await AddVehicle.findById(item.vehicleId).lean();
          if (vehicle) vehicles.push(vehicle);
        }
      }

      // Determine assigned shop
      let shopName = "Not Assigned";
      for (const shop of shops) {
        const found = shop.orders.find(
          (o) => o.orderId.toString() === order._id.toString()
        );
        if (found) {
          shopName = shop.name;
          break;
        }
      }

      summary.push({
        username: user?.name || "Unknown User",
        appointmentTime: appointment.time,
        appointmentDate: appointment.date,
        vehicles: vehicles.length > 0 ? vehicles : "No vehicle",
        shopName,
        doorstepService: true,
        totalPrice: order.totalPrice || 0,
      });
    }

    return res.status(200).json({ summary });
  } catch (err) {
    console.error("Error fetching order summary:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getOrderSummaryByDateForMonth };
