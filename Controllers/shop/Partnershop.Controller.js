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
      pincode,
      region,
      noOfStaff,
      openingTime,
      closingTime,
      daysOfOperation,
    } = req.body;

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
const GetShopStocks = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userId : ", userId);
    const shop = await Shop.findOne({ userId: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Return only the shopStocks data
    res.status(200).json({ shopStocks: shop.ShopStocks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateShop = async (req, res) => {
  console.log("shop : ", req.body);
  try {
    const {
      _id,
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

    const shop = await Shop.findByIdAndUpdate(
      _id,
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
const GetOrdersAssigned = async (req, res) => {
  try {
    const userid = req.user.userId;
    console.log("userid : ", userid);
    
    // Find shop and populate orders with appointment details
    const shop = await Shop.findOne({ userId: userid })
      .populate({
        path: 'orders.orderId',
        model: 'Appointment',
        populate: [
          {
            path: 'addressId',
            model: 'Address'
          },
          {
            path: 'orderinfo',
            model: 'ClientOrder',
            strictPopulate: false, // Allow population of paths not in schema
            populate: [
              {
                path: 'tyres',
                model: 'Tyre',
                strictPopulate: false // Allow population of tyres not in schema
              },
              {
                path: 'services',
                model: 'Service'
              }
            ]
          }
        ]
      });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.orders || shop.orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Return populated orders array
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
  GetShopStocks,
  GetOrdersAssigned,
};
