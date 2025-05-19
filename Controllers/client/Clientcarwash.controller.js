const axios = require("axios");
const CarwashShop = require("../../Models/Carwash/Shop");
const { calculateDistance } = require("../../Utils/Distance");

const getNearbyCarwashShops = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    console.log("Request Body:", req.body);

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return res.status(400).json({
        error: "Valid latitude and longitude are required in request body",
      });
    }

    const shops = await CarwashShop.find().populate(
      "userReviews.userId",
      "name"
    ); // Optional: populate user names

    const clientCoordinates = { latitude, longitude };

    const shopDistances = await Promise.all(
      shops.map(async (shop) => {
        if (!shop.pincode) return null;

        const result = await calculateDistance(shop.pincode, clientCoordinates);

        if (
          result &&
          typeof result.distance === "number" &&
          result.distance <= 2000
        ) {
          const reviews = shop.userReviews || [];

          // Calculate average review
          const totalReviews = reviews.length;
          const sum = reviews.reduce((acc, curr) => acc + curr.review, 0);
          const averageReview =
            totalReviews > 0 ? (sum / totalReviews).toFixed(1) : null;

          return {
            _id: shop._id,
            name: shop.name,
            phoneNumber: shop.phoneNumber,
            businessAddress: shop.businessAddress,
            pincode: shop.pincode,
            region: shop.region,
            openingTime: shop.openingTime,
            closingTime: shop.closingTime,
            daysOfOperation: shop.daysOfOperation,
            distance: result.distance.toFixed(2),
            averageReview,
            userReviews: reviews.map((r) => ({
              userId: r.userId?._id || r.userId,
              userName: r.userId?.name || "Anonymous",
              review: r.review,
              description: r.description,
            })),
          };
        }

        return null;
      })
    );

    const nearbyShops = shopDistances.filter(Boolean);
    nearbyShops.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.status(200).json({
      clientCoordinates: { latitude, longitude },
      shops: nearbyShops,
    });
  } catch (error) {
    console.error("Error in getNearbyCarwashShops:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const placeOrderToShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { userId } = req.user;
    const { appointmentDate, appointmentTime, washType } = req.body;
    console.log("shopId : ", shopId);
    console.log("request body : ", req.body);

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "appointmentDate and appointmentTime are required" });
    }

    const shop = await CarwashShop.findById(shopId);
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

    // Update orders array using $push operator to ensure proper validation
    const updatedShop = await CarwashShop.findByIdAndUpdate(
      shopId,
      { $push: { orders: newOrder } },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedShop) {
      return res.status(500).json({ error: "Failed to update shop with new order" });
    }

    return res.status(200).json({
      message: "Order placed successfully",
      shop: updatedShop,
      appointmentDetails: {
        date: appointmentDate,
        time: appointmentTime,
        washType: newOrder.washType
      },
    });
  } catch (error) {
    console.error("Error placing order:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation Error", 
        details: Object.values(error.errors).map(err => err.message)
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
    console.log("User ID:", userId);
    console.log("Review:", review);
    console.log("Description:", description);
    if (!userId || typeof review !== "number") {
      return res
        .status(400)
        .json({ error: "userId and numeric review are required." });
    }

    const shop = await CarwashShop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    shop.userReviews.push({ userId, review, description });
    await shop.save();

    return res.status(200).json({ message: "Review added successfully", shop });
  } catch (error) {
    console.error("Error posting review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getNearbyCarwashShops,
  placeOrderToShop,
  postReviewToShop,
};
