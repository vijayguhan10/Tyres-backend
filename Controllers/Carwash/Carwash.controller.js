const Shop = require("../../Models/Carwash/Shop");

// Get a shop by ID
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new order to a shop
const addOrderToShop = async (req, res) => {
  try {
    const { shopId, orderId, status } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    shop.orders.push({ orderId, status: status || "pending" });
    await shop.save();
    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Change the status of an order in a shop
const changeOrderStatus = async (req, res) => {
  try {
    const { shopId, orderId, status } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const order = shop.orders.find((o) => o.orderId.toString() === orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found in shop" });
    }
    order.status = status;
    await shop.save();
    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const placeOrderToShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { userId } = req.user;
    const { appointmentDate, appointmentTime } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!appointmentDate || !appointmentTime) {
      return res
        .status(400)
        .json({ error: "appointmentDate and appointmentTime are required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Create new order object with all required fields
    const newOrder = {
      orderId: userId,
      status: "pending",
      appointmentDate: new Date(appointmentDate),
      appointmentTime: appointmentTime,
    };

    // Update orders array and get the new order's _id
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { $push: { orders: newOrder } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedShop) {
      return res
        .status(500)
        .json({ error: "Failed to update shop with new order" });
    }

    // Get the _id of the newly created order
    const newOrderId = updatedShop.orders[updatedShop.orders.length - 1]._id;

    return res.status(200).json({
      orderid: newOrderId
    });
  } catch (error) {
    console.error("Error placing order:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const postReviewToShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { review, description } = req.body;
    const { userId } = req.user;

    // Input validation
    if (!userId || typeof review !== "number") {
      return res
        .status(400)
        .json({ error: "userId and numeric review are required." });
    }

    // Find and update shop using findByIdAndUpdate to avoid validation issues
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      {
        $push: {
          userReviews: { userId, review, description },
        },
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedShop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json({
      message: "Review added successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Error posting review:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getShopById,
  placeOrderToShop,
  postReviewToShop,
  addOrderToShop,
  changeOrderStatus,
};
