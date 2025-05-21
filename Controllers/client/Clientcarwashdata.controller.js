const Clientcarwash = require("../../Models/client/Clientcarwashdata");
const axios = require("axios");
const CarwashShop = require("../../Models/Carwash/Shop");
const { calculateDistance } = require("../../Utils/Distance");
// Create a new client carwash record
const createClientCarwash = async (req, res) => {
  try {
    const { orderid, shopid, review } = req.body;
    const { userId } = req.user;
    const newRecord = new Clientcarwash({ userId: userId, orderid, shopid, review });
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all client carwash records for the current user
const getAllClientCarwash = async (req, res) => {
  try {
    const { userId } = req.user;
    const records = await Clientcarwash.find({ userId: userId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single client carwash record by ID
const getClientCarwashById = async (req, res) => {
  try {
    const record = await Clientcarwash.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a client carwash record
const updateClientCarwash = async (req, res) => {
  try {
    const { orderid, shopid, review } = req.body;
    const { userId } = req.user;
    const updatedRecord = await Clientcarwash.findByIdAndUpdate(
      req.params.id,
      {
        userId: userId,
        ...(orderid && { orderid }),
        ...(shopid && { shopid }),
        ...(review && { review }),
      },
      { new: true, runValidators: true }
    );
    if (!updatedRecord)
      return res.status(404).json({ error: "Record not found" });
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a client carwash record
const deleteClientCarwash = async (req, res) => {
  try {
    const deletedRecord = await Clientcarwash.findByIdAndDelete(req.params.id);
    if (!deletedRecord)
      return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or update review for a record by _id
const addOrUpdateReview = async (req, res) => {
  try {
    const { orderid } = req.params;
    console.log(id);
    const { review, description } = req.body;
    const { userId } = req.user;
    if (!userId || typeof review !== "number" || !description) {
      return res.status(400).json({ error: "userId, review (number), and description are required" });
    }
    const updated = await Clientcarwash.findByIdAndUpdate(
      orderid,
      {
        review: { userId: userId, review, description }
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Record not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


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

module.exports = {
  createClientCarwash,
  getAllClientCarwash,
  getClientCarwashById,
  updateClientCarwash,
  deleteClientCarwash,
  addOrUpdateReview,
  getNearbyCarwashShops,
};