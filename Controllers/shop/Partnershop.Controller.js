const Shop = require("../../Models/shop/Shop");
const Address = require("../../Models/Address");
const Appointment = require("../../Models/client/Appointment");
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
const getshopmetadata = async (req, res) => {
  try {
    const userId = req.user.userId;
    const shop = await Shop.findOne({ userId: userId })
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
    await shop.populate({
      path: 'ShopStocks.tyreId',
      model: 'addtyre',
      select: 'brand model type vehicleType loadIndex speedRating price'
    });

    const formattedShopStocks = shop.ShopStocks.map(stock => ({
      tyreId: stock.tyreId?._id,
      tyreDetails: stock.tyreId ? {
        brand: stock.tyreId.brand,
        model: stock.tyreId.model,
        type: stock.tyreId.type,
        vehicleType: stock.tyreId.vehicleType,
        
        price: stock.tyreId.price
      } : null,
      sizes: stock.sizes
    }));

    res.status(200).json({ shopStocks: formattedShopStocks });
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

    const shop = await Shop.findByIdAndUpdate(
      _id,
      {
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
      },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    console.log("sucessfully updated shop");
    return res.status(200).json(shop);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const GetOrdersAssigned = async (req, res) => {
  try {
    const userid = req.user.userId;
    console.log("userid : ", userid);

    // Step 1: Find the shop and deeply populate appointment details
    const shop = await Shop.findOne({ userId: userid });
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Populate orders only if shop exists
    await shop.populate({
      path: "orders.orderId",
      model: "Appointment",
      populate: [
        { path: "userId", model: "User", select: "name" },
        { path: "addressId", model: "Address" },
        {
          path: "orderinfo",
          model: "ClientOrder",
          populate: {
            path: "orderItems.tyre",
            model: "addtyre",
            select: "model brand stock",
          },
        },
      ],
    });

    if (!shop.orders || shop.orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Step 3: Divide orders into 'pending' and 'completed'
    const pendingOrders = [];
    const completedOrders = [];

    for (const order of shop.orders) {
      if (!order.orderId) continue; 
      
      const orderObj = {
        ...order.toObject(),
        appointmentId: order.orderId._id,
      };

      if (order.status === "pending") {
        pendingOrders.push(orderObj);
      } else if (order.status === "completed") {
        completedOrders.push(orderObj);
      }
    }

    // Step 4: Return the divided results with appointment IDs
    res.status(200).json({
      shopId: shop._id,
      userId: shop.userId,
      pendingOrders,
      completedOrders,
    });
  } catch (error) {
    console.error("Error in GetOrdersAssigned:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const completeorder = async (req, res) => {
  try {
    const userid = req.user.userId;
    const { appointmentid, orderid } = req.body;
    console.log("userid : ", userid);
    console.log("appointmentid : ", appointmentid);
    console.log("orderid : ", orderid);

    // Find shop and validate
    const shop = await Shop.findOne({ userId: userid });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Validate orderid and appointmentid
    if (!orderid || !appointmentid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find and update order status in shop
    const orderIndex = shop.orders.findIndex(
      (order) => order.orderId && order.orderId.toString() === orderid
    );
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found in shop" });
    }
    shop.orders[orderIndex].status = "completed";

    // Find appointment and validate
    const appointment = await Appointment.findById(appointmentid);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status
    appointment.orderstatus = "completed";

    // Save both documents
    await Promise.all([shop.save(), appointment.save()]);

    return res.status(200).json({
      message: "Order completed successfully",
      shop: shop.orders[orderIndex],
      appointment: appointment,
    });
  } catch (error) {
    console.error("Error completing order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getrequestedtyresall = async (req, res) => {
  try {
    const userid = req.user.userId;
    console.log("userid : ", userid);

    // Find shop and populate tyre request details
    const shop = await Shop.findOne({ userId: userid }).populate({
      path: "TyresRequested",
      populate: {
        path: "specification.tyreId",
        model: "addtyre",
        select: "brand model type vehicleType loadIndex speedRating price",
      },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.TyresRequested || shop.TyresRequested.length === 0) {
      return res.status(404).json({ message: "No tyre requests found" });
    }

    // Format the response with required tyre details
    const formattedRequests = shop.TyresRequested.map((request) => ({
      requestId: request._id,
      userId: request.userId,
      ShopId: request.ShopId,
      status: request.status,
      deleterequest: request.deleterequest,
      comments: request.comments,
      price: request.price || 0,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      specifications: request.specification.map((spec) => ({
        size: spec.size,
        quantity: spec.quantity,
        tyreDetails: spec.tyreId
          ? {
              brand: spec.tyreId.brand,
              model: spec.tyreId.model,
              type: spec.tyreId.type,
              vehicleType: spec.tyreId.vehicleType,
              loadIndex: spec.tyreId.loadIndex,
              speedRating: spec.tyreId.speedRating,
            }
          : null,
      })),
    }));

    res.status(200).json({
      shopId: shop._id,
      tyreRequests: formattedRequests,
    });
  } catch (error) {
    console.error("Error fetching tyre requests:", error);
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
  getshopmetadata,
  completeorder,
  getrequestedtyresall,
};
