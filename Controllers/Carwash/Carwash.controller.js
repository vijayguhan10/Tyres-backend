const Shop = require("../../Models/shop/Shop");
const createShop = async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all shops
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
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

// Update a shop by ID
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const order = shop.orders.find(o => o.orderId.toString() === orderId);
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

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  addOrderToShop,
  changeOrderStatus
};