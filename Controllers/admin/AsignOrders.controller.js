const Shop = require("../../Models/shop/Shop");
const addOrderToShop = async (req, res) => {
  try {
    const { shopId, orderId } = req.body;

    if (!shopId || !orderId) {
      return res
        .status(400)
        .json({ message: "Shop ID and Order ID are required" });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.orders.push(orderId);

    await shop.save();

    res.status(200).json({ message: "Order added to shop successfully", shop });
  } catch (error) {
    console.error("Error adding order to shop:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTyreRequestToShop = async (req, res) => {
  try {
    const { shopId, tyreRequestId } = req.body;

    if (!shopId || !tyreRequestId) {
      return res
        .status(400)
        .json({ message: "Shop ID and Tyre Request ID are required" });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.TyresRequested.push(tyreRequestId);

    await shop.save();

    res
      .status(200)
      .json({ message: "Tyre request added to shop successfully", shop });
  } catch (error) {
    console.error("Error adding tyre request to shop:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addTyreRequestToShop,addOrderToShop };

