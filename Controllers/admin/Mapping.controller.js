const Mapping = require("../../Models/admin/Mapping");
const Shop = require("../../Models/shop/Shop");
const ClientOrder = require("../../Models/client/OrderTyre");

// Create a new Mapping
const createMapping = async (req, res) => {
  try {
    const { shopId, orderId } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shop ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Check if shopId exists
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return res.status(400).json({ message: "Shop not found" });
    }

    // Check if orderId exists
    const orderExists = await ClientOrder.findById(orderId);
    if (!orderExists) {
      return res.status(400).json({ message: "Order not found" });
    }

    // Create the mapping
    const mapping = await Mapping.create(req.body);
    res.status(201).json(mapping);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Mappings
const getAllMappings = async (req, res) => {
  try {
    const mappings = await Mapping.find()
      .populate("shopId") // Optional: populate shop details
      .populate("orderId"); // Optional: populate order details
    res.status(200).json(mappings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Mapping by ID
const getMappingById = async (req, res) => {
  try {
    const mapping = await Mapping.findById(req.params.id)
      .populate("shopId")
      .populate("orderId");
    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }
    res.status(200).json(mapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Mappings for a specific shop
const getMappingsByShopId = async (req, res) => {
  try {
    const mappings = await Mapping.find({ shopId: req.params.shopId })
      .populate("shopId")
      .populate("orderId");
    if (!mappings || mappings.length === 0) {
      return res
        .status(404)
        .json({ message: "No mappings found for this shop" });
    }
    res.status(200).json(mappings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Mapping
const deleteMapping = async (req, res) => {
  try {
    const mapping = await Mapping.findByIdAndDelete(req.params.id);
    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }
    res.status(200).json({ message: "Mapping deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMapping,
  getAllMappings,
  getMappingById,
  getMappingsByShopId,
  deleteMapping,
};
