const TyreRequests = require("../../Models/shop/RequestTyres");
const Tyre = require("../../Models/admin/Addtyre");
const Shop = require("../../Models/shop/Shop");
exports.getTyreRequestsByStatus = async (req, res) => {
  try {
    const allRequests = await TyreRequests.find().populate("ShopId");
    const pending = allRequests.filter((r) => r.status === "Pending");
    const approved = allRequests.filter((r) => r.status === "Approved");
    const rejected = allRequests.filter((r) => r.status === "Rejected");
    res.status(200).json({
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tyre requests" });
  }
};
exports.AssignTyres = async (req, res) => {
  try {
    const { requestId, specifications, shopId } = req.body;

    const tyreRequest = await TyreRequests.findById(requestId);
    if (!tyreRequest) {
      return res.status(404).json({ error: "Tyre request not found" });
    }

    // Find the shop and validate its existence
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Process each specification
    for (const spec of specifications) {
      const { tyreId, size, quantity, price } = spec;

      const tyre = await Tyre.findById(tyreId);
      if (!tyre) {
        return res.status(404).json({ error: `Tyre with ID ${tyreId} not found` });
      }

      const stockItem = tyre.stock.find((item) => item.size === size);
      if (!stockItem) {
        return res.status(404).json({ error: `Size ${size} not found in tyre ${tyreId}` });
      }

      if (stockItem.quantity < quantity) {
        return res.status(400).json({
          error: `Insufficient stock for size ${size}. Available: ${stockItem.quantity}, Requested: ${quantity}`,
        });
      }

      // Update shop's stock
      const stockIndex = shop.ShopStocks.findIndex(
        (item) => item.tyreId?.toString() === tyreId.toString()
      );

      if (stockIndex !== -1) {
        // Tyre exists in shop stock
        const sizeIndex = shop.ShopStocks[stockIndex].sizes.findIndex(
          (s) => s.size === size
        );

        if (sizeIndex !== -1) {
          // Size exists, update quantity
          shop.ShopStocks[stockIndex].sizes[sizeIndex].quantity += quantity;
        } else {
          // Size doesn't exist, add new size entry
          shop.ShopStocks[stockIndex].sizes.push({
            size,
            quantity,
            price: price || 0,
          });
        }
      } else {
        // Tyre doesn't exist in shop stock, add new entry
        shop.ShopStocks.push({
          tyreId,
          sizes: [{
            size,
            quantity,
            price: price || 0,
          }],
        });
      }

      // Decrease main stock quantity
      stockItem.quantity -= quantity;
      await tyre.save();
    }

    // Save shop changes
    await shop.save();

    tyreRequest.status = "Approved";
    await tyreRequest.save();

    res.status(200).json({
      message: "Tyres assigned successfully",
      request: tyreRequest,
    });
  } catch (error) {
    console.error("Error in AssignTyres:", error);
    res.status(500).json({ error: "Error assigning tyres" });
  }
};
