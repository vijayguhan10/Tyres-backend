const Owninventory = require("../../Models/shop/Owninventory");
const fitmentshop = require("../../Models/shop/Shop");
const Shop=require("../../Models/shop/Shop")
// Create Owninventory and add to Shop's OwnInventory
exports.createOwnInventory = async (req, res) => {
  try {
    const { userId } = req.user;
    const inventoryData = req.body;

    // Find shop by userId
    const shop = await fitmentshop.findOne({ userId: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    // Create inventory
    const newInventory = await Owninventory.create(inventoryData);

    // Set Shop's OwnInventory to the new inventory's _id
    shop.OwnInventory.push(newInventory._id);
    await shop.save();

    res.status(201).json({
      message: "Inventory created and added to shop",
      data: newInventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Owninventory items for the current user's shop
exports.getAllOwnInventory = async (req, res) => {
    console.log("getAllOwnInventory");
  try {
    if (!req.user || !req.user.userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const { userId } = req.user;
    const shop = await Shop
      .findOne({ userId: userId })
      .populate({
        path: 'OwnInventory',
        model: 'Owninventory' 
      });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    // Check if OwnInventory exists and has items
    if (!shop.OwnInventory || shop.OwnInventory.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(shop.OwnInventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Owninventory by ID (only if it belongs to the current user's shop)
exports.getOwnInventoryById = async (req, res) => {
  try {
    const { userId } = req.user;
    const shop = await fitmentshop.findOne({ userId: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }
    const inventory = await Owninventory.findById(req.params.id);
    if (!inventory || !shop.OwnInventory || shop.OwnInventory.toString() !== inventory._id.toString()) {
      return res
        .status(404)
        .json({ message: "Inventory not found in your shop" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Owninventory by ID (only if it belongs to the current user's shop)
exports.updateOwnInventory = async (req, res) => {
  try {
    const { userId } = req.user;
    const shop = await fitmentshop.findOne({ userId: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }
    const inventory = await Owninventory.findById(req.params.id);
    if (!inventory || !shop.OwnInventory || shop.OwnInventory.toString() !== inventory._id.toString()) {
      return res
        .status(404)
        .json({ message: "Inventory not found in your shop" });
    }
    const updatedInventory = await Owninventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Inventory updated", data: updatedInventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Owninventory by ID and remove from Shop's OwnInventory (only if it belongs to the current user's shop)
exports.deleteOwnInventory = async (req, res) => {
  try {
    const { userId } = req.user;
    const shop = await fitmentshop.findOne({ userId: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }
    const inventory = await Owninventory.findById(req.params.id);
    if (!inventory || !shop.OwnInventory || shop.OwnInventory.toString() !== inventory._id.toString()) {
      return res
        .status(404)
        .json({ message: "Inventory not found in your shop" });
    }
    await Owninventory.findByIdAndDelete(req.params.id);
    shop.OwnInventory = null;
    await shop.save();
    res
      .status(200)
      .json({ message: "Inventory deleted and removed from shop" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
