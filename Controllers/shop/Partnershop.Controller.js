const Shop = require("../../Models/shop/Shop");
const Address = require("../../Models/Address");

const createShop = async (req, res) => {
  console.log("shop : ", req.body);
  try {
    let {
      userId,
      name,
      adminNotes,
      phoneNumber,
      businessAddress,

      region,
      noOfStaff,
      openingTime,
      closingTime,
      daysOfOperation,
    } = req.body;
    let pincode = "5543333";
   

    const newShop = new Shop({
      userId,
      name,
      adminNotes,
      phoneNumber,
      businessAddress,
      pincode,
      region,
      noOfStaff,
      openingTime,
      closingTime,
      daysOfOperation,
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
    const { ShopId } = req.body;
    const shop = await Shop.findById(ShopId)
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
    const {
      userId,
      name,
      address,
      orders,
      TyresRequested,
      adminNotes,
      phoneNumber,
      businessAddress,
      pincode,
      region,
      noOfStaff,
      openingTime,
      closingTime,
      daysOfOperation,
    } = req.body;

    if (address) {
      const validAddress = await Address.findById(address);
      if (!validAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
    }

    const shop = await Shop.findOneAndUpdate(
      { userId },
      {
        name,
        address,
        orders,
        TyresRequested,
        adminNotes,
        phoneNumber,
        businessAddress,
        pincode,
        region,
        noOfStaff,
        openingTime,
        closingTime,
        daysOfOperation,
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
