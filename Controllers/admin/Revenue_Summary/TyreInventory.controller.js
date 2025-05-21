const Shop = require("../../../Models/shop/Shop");
const TyreInfo = require("../../../Models/client/OrderTyre");
const Appointment = require("../../../Models/client/Appointment");

const getTyreRevenueSummary = async (req, res) => {
  try {
    // Get shop information using userId from JWT token
    const userId = req.user.userId;
    const shop = await Shop.findOne({ userId: userId })
      .populate("orders.orderId")
      .populate("ShopStocks.tyreId"); 

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Get all completed order IDs from the shop
    const completedOrderIds = shop.orders
      .filter((order) => order.status === "completed")
      .map((order) => order.orderId);

    // Get all completed appointments with their order details
    const completedAppointments = await Appointment.find({
      _id: { $in: completedOrderIds },
    }).populate({
      path: "orderinfo",
      populate: {
        path: "orderItems.tyre",
      },
    });

    // Initialize revenue summary object with all tyres from stock
    const revenueSummary = {};

    // First, add all tyres from stock with zero revenue
    shop.ShopStocks.forEach((stock) => {
      const tyreId = stock.tyreId._id.toString();
      if (!revenueSummary[tyreId]) {
        revenueSummary[tyreId] = {
          tyreName: stock.tyreId.name,
          sizes: {},
        };
      }

      // Initialize all sizes with zero revenue
      stock.sizes.forEach((size) => {
        if (!revenueSummary[tyreId].sizes[size.size]) {
          revenueSummary[tyreId].sizes[size.size] = {
            revenue: 0,
            quantity: 0,
            currentStock: size.quantity,
            currentPrice: size.price,
          };
        }
      });
    });

    // Process each completed appointment to add revenue data
    completedAppointments.forEach((appointment) => {
      if (appointment.orderinfo && appointment.orderinfo.orderItems) {
        appointment.orderinfo.orderItems.forEach((item) => {
          const tyreId = item.tyre._id.toString();
          const size = item.size;
          const revenue = item.price * item.quantity;

          // If this tyre/size combination exists in stock, update its revenue
          if (revenueSummary[tyreId] && revenueSummary[tyreId].sizes[size]) {
            revenueSummary[tyreId].sizes[size].revenue += revenue;
            revenueSummary[tyreId].sizes[size].quantity += item.quantity;
          }
        });
      }
    });

    // Convert to final format
    const finalSummary = Object.entries(revenueSummary).map(
      ([tyreId, data]) => ({
        tyreId,
        tyreName: data.tyreName,
        sizes: Object.entries(data.sizes).map(([size, info]) => ({
          size,
          revenue: info.revenue,
          quantitySold: info.quantity,
          currentStock: info.currentStock,
          currentPrice: info.currentPrice,
        })),
      })
    );

    return res.status(200).json({
      success: true,
      data: finalSummary,
    });
  } catch (error) {
    console.error("Error in getTyreRevenueSummary:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = {
  getTyreRevenueSummary,
};
