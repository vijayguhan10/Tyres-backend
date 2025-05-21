const Shop = require("../../Models/shop/Shop");
const Appointment = require("../../Models/client/Appointment");

const getOrderSummaryByShop = async (req, res) => {
  try {
    // Get all shops with only name and orders fields
    const shops = await Shop.find({}, { name: 1, orders: 1 });
    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found" });
    }

    const summary = [];

    for (const shop of shops) {
      let completedCount = 0;
      // Extract all orderIds from shop.orders
      const orderIds = (shop.orders || []).map(order => order.orderId);
      if (orderIds.length > 0) {
        // Fetch all appointments for these orderIds, only orderinfo and orderstatus
        const appointments = await Appointment.find({
          _id: { $in: orderIds }
        }, { orderinfo: 1, orderstatus: 1 });
        // Count completed orders
        completedCount = appointments.filter(app => app.orderstatus === "completed").length;
      }
      summary.push({
        shopName: shop.name,
        completedOrders: completedCount
      });
    }

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in getOrderSummaryByShop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getOrderSummaryByShop };