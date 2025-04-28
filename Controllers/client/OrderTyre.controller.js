const TyreInfo = require("../../Models/client/OrderTyre");
const Tyre = require("../../Models/admin/Addtyre");
// Helper function to reduce stock
async function reduceStock(brand, model, size, quantity) {
  const tyre = await Tyre.findOne({ brand, model });

  if (!tyre) throw new Error("Tyre not found for the given brand and model");
  const stockItem = tyre.stock.find((item) => item.size === size);

  if (!stockItem) {
    throw new Error(`Size ${size} not available`);
  }

  if (stockItem.quantity < quantity) {
    throw new Error(
      `Not enough stock for size ${size}. Available: ${stockItem.quantity}`
    );
  }

  stockItem.quantity -= quantity;
  await tyre.save();
}


async function increaseStock(brand, model, size, quantity) {
  const tyre = await Tyre.findOne({ brand, model });

  if (!tyre) throw new Error("Tyre not found for the given brand and model");

  const stockItem = tyre.stock.find((item) => item.size === size);

  if (!stockItem) {
    throw new Error(`Size ${size} not available in stock`);
  }
  stockItem.quantity += quantity;

  await tyre.save();
}

const createTyreInfo = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  console.log("Request body for ordering tyres:", req.body);

  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can order tyres" });
    }

    const { brand, model, type, vehicleType, price, stock } = req.body;

    if (!stock || stock.length === 0) {
      return res.status(400).json({ message: "Stock details are required" });
    }

    for (const item of stock) {
      await reduceStock(brand, model, item.size, item.quantity);
    }

    const newTyreInfo = new TyreInfo({
      userId: req.user.userId,
      brand,
      model,
      type,
      vehicleType,
      price,
      stock,
      status: req.body.status || "Pending",
    });
    const savedTyreInfo = await newTyreInfo.save();
    res.status(201).json(savedTyreInfo);
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getTyreInfos = async (req, res) => {
  try {
    const tyreInfos = await TyreInfo.find().populate("userId", "name email");
    res.status(200).json(tyreInfos);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTyreInfoById = async (req, res) => {
  try {
    const tyreInfo = await TyreInfo.findById(req.params.id).populate(
      "userId",
      "name email"
    );

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
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const tyreInfo = await TyreInfo.findById(req.params.id);

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre order not found" });
    }

    if (req.body.stock) {
      for (const item of tyreInfo.stock) {
        await increaseStock(
          tyreInfo.brand,
          tyreInfo.model,
          item.size,
          item.quantity
        );
      }

      for (const item of req.body.stock) {
        await reduceStock(
          tyreInfo.brand,
          tyreInfo.model,
          item.size,
          item.quantity
        );
      }

      tyreInfo.stock = req.body.stock;
    }

    tyreInfo.status = req.body.status || tyreInfo.status;
    const updatedTyreInfo = await tyreInfo.save();
    res.status(200).json(updatedTyreInfo);
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteTyreInfo = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

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

module.exports = {
  createTyreInfo,
  getTyreInfos,
  getTyreInfoById,
  updateTyreInfo,
  deleteTyreInfo,
};
