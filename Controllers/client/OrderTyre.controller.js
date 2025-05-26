const TyreInfo = require("../../Models/client/OrderTyre");
const addtyre = require("../../Models/admin/Addtyre");
const mongoose = require("mongoose");

// These functions are no longer needed since we're not checking stock
// async function reduceStock(tyreId, quantity) {
//   const tyre = await Tyre.findById(tyreId);

//   if (!tyre) throw new Error("Tyre not found");
//
//   if (tyre.quantity < quantity) {
//     throw new Error(
//       `Not enough stock. Available: ${tyre.quantity}`
//     );
//   }

//   tyre.quantity -= quantity;
//   await tyre.save();
// }

// async function increaseStock(tyreId, quantity) {
//   const tyre = await Tyre.findById(tyreId);

//   if (!tyre) throw new Error("Tyre not found");

//   tyre.quantity += quantity;
//   await tyre.save();
// }

async function validateOrderItems(orderItems) {
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error("Order items are required and must be an array");
  }

  const tyreIds = orderItems.map((item) => item.tyre);
  const invalidIds = tyreIds.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidIds.length > 0) {
    throw new Error(`Invalid tyre ID format: ${invalidIds.join(", ")}`);
  }

  // Only check if tyres exist, don't validate stock
  const tyres = await addtyre.find({ _id: { $in: tyreIds }, deleted: false });
  console.log(tyres);
  if (tyres.length !== tyreIds.length) {
    const foundIds = tyres.map((tyre) => tyre._id.toString());
    const missingIds = tyreIds.filter((id) => !foundIds.includes(id));
    throw new Error(
      `Some tyres do not exist or are deleted: ${missingIds.join(", ")}`
    );
  }

  for (const item of orderItems) {
    if (!item.quantity || item.quantity < 1) {
      throw new Error("Quantity must be at least 1 for all items");
    }

    if (!item.size) {
      throw new Error("Size is required for all items");
    }

    // No longer checking stock availability
    // Just verify the tyre exists
    const tyre = tyres.find((t) => t._id.toString() === item.tyre.toString());
    if (!tyre) continue;

    // Check if the size exists in the tyre's stock but don't check quantity
    const stockItem = tyre.stock.find((stock) => stock.size === item.size);
    if (!stockItem) {
      throw new Error(
        `Size ${item.size} not found for ${tyre.brand} ${tyre.model}`
      );
    }

    // Stock quantity check remove
    item.price = stockItem.price;
  }

  return tyres;
}

const createTyreInfo = async (req, res) => {
  console.log("Request body for ordering tyres:", req.body);
  try {
    const { orderItems } = req.body;
    const clientType = req.user.levellogin;

    await validateOrderItems(orderItems);

    const totalPrice = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const newTyreInfo = new TyreInfo({
      userId: req.user.userId,
      orderItems: orderItems,
      status: req.body.status || "Pending",
      clientType: clientType,
      totalPrice: totalPrice,
    });

    const savedTyreInfo = await newTyreInfo.save();
    res.status(201).json(savedTyreInfo);
  } catch (error) {
    console.log("error:", error.message);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

const getTyreInfos = async (req, res) => {
  try {
    const tyreInfos = await TyreInfo.find()
      .populate("userId", "name email")
      .populate("orderItems.tyre");
    res.status(200).json(tyreInfos);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTyreInfoById = async (req, res) => {
  try {
    const tyreInfo = await TyreInfo.findById(req.params.id)
      .populate("userId", "name email")
      .populate("orderItems.tyre");

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre order not found" });
    }

    res.status(200).json(tyreInfo);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTyreInfo = async (req, res) => {
  try {
    const tyreInfo = await TyreInfo.findById(req.params.id);

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre order not found" });
    }

    if (req.body.orderItems) {
      await validateOrderItems(req.body.orderItems);
      tyreInfo.orderItems = req.body.orderItems;
    }

    if (req.body.status) {
      tyreInfo.status = req.body.status;
    }

    const updatedTyreInfo = await tyreInfo.save();
    res.status(200).json(updatedTyreInfo);
  } catch (error) {
    console.log("error:", error.message);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

const deleteTyreInfo = async (req, res) => {
  try {
    const tyreInfo = await TyreInfo.findById(req.params.id);

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre order not found" });
    }

    tyreInfo.deleted = true;
    await tyreInfo.save();

    res
      .status(200)
      .json({ message: "Tyre order marked as deleted successfully" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["Pending", "Completed", "Issues"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: Pending, Completed, Issues",
      });
    }

    const tyreInfo = await TyreInfo.findById(id);

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre order not found" });
    }

    tyreInfo.status = status;
    const updatedTyreInfo = await tyreInfo.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedTyreInfo,
    });
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createTyreInfo,
  getTyreInfos,
  getTyreInfoById,
  updateTyreInfo,
  deleteTyreInfo,
  updateOrderStatus,
};
