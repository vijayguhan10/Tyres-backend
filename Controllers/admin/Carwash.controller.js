const Shop = require("../../Models/Carwash/Shop");
const createShop = async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update a shop by ID
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a shop by ID
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json({ message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all shops
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('userId', 'name');
    
    const shopsWithReviews = shops.map(shop => {
      const reviews = shop.userReviews || [];
      const totalReviews = reviews.length;
      const sum = reviews.reduce((acc, curr) => acc + curr.review, 0);
      const averageReview = totalReviews > 0 ? (sum / totalReviews).toFixed(1) : null;

      return {
        _id: shop._id,
        userId: shop.userId?._id,
        ownerName: shop.userId?.name,
        name: shop.name,
        description: shop.description,
        phoneNumber: shop.phoneNumber,
        businessAddress: shop.businessAddress,
        pincode: shop.pincode,
        region: shop.region,
        noOfStaff: shop.noOfStaff,
        openingTime: shop.openingTime,
        closingTime: shop.closingTime,
        daysOfOperation: shop.daysOfOperation,
        averageReview,
        totalReviews,
        userReviews: reviews.map(r => ({
          userId: r.userId,
          review: r.review,
          description: r.description
        })),
        orders: shop.orders,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt
      };
    });

    res.status(200).json(shopsWithReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
// Get carwash summary by shop
const getCarwashSummaryByShop = async (req, res) => {
  try {
    const shops = await Shop.find({}, 'name orders');
    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found" });
    }

    const summary = shops.map(shop => {
      const completedOrders = shop.orders.filter(order => order.status === 'completed').length;
      return {
        shopName: shop.name,
        completedCarwashes: completedOrders
      };
    });

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShop,
  updateShop,
  deleteShop,
  getAllShops,
  getShopById,
  getCarwashSummaryByShop
};
