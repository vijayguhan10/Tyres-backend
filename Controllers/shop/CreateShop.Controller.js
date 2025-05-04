const Shop = require("../../Models/shop/Shop");
const Address = require("../../Models/Address");

const createShop = async (req, res) => {
  try {
    const { name, address } = req.body;
    const validAddress = await Address.findById(address);
    if (!validAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    const newShop = new Shop({
      userId: req.user.userId,
      name,
      address,
    });

    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getShopByUserId = async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.user.userId })
      .populate("address")
      .populate("orders")
      .populate("TyresRequested");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate("address")
      .populate("orders")
      .populate("TyresRequested");

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found" });
    }

    res.status(200).json(shops);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateShop = async (req, res) => {
  try {
    const { name, address, orders, TyresRequested } = req.body;

    if (address) {
      const validAddress = await Address.findById(address);
      if (!validAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
    }

    const shop = await Shop.findOneAndUpdate(
      { userId: req.user.userId },
      {
        name: name || undefined,
        address: address || undefined,
        orders: orders || undefined,
        TyresRequested: TyresRequested || undefined,
      },
      { new: true }
    )
      .populate("address")
      .populate("orders")
      .populate("TyresRequested");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createShop,
  getShopByUserId,
  updateShop,
  getAllShops,
};
