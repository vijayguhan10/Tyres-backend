const TyreRequest = require("../../Models/shop/RequestTyres");
const Tyre = require("../../Models/admin/Addtyre");
const Shop = require("../../Models/shop/Shop");
const clientOrder = require("../../Models/client/OrderTyre");
const Appointment = require("../../Models/client/Appointment");
const { sendNotificationEmail } = require("../../Utils/Email");

exports.createTyreRequest = async (req, res, next) => {
  try {
    const {
      userId,
      ShopId,
      comments,
      specification,
      pushtire,
      appointmentId,
      clientOrderId,
    } = req.body;

    // Validate required fields
    if (!appointmentId || !clientOrderId) {
      return res
        .status(400)
        .json({ error: "Appointment ID and Client Order ID are required" });
    }

    let totalPrice = 0;
    const approvedSpecs = [];

    // Check tyre availability
    for (const spec of specification) {
      const tyre = await Tyre.findById(spec.tyreId);
      if (!tyre) continue;

      const stockEntry = tyre.stock.find((s) => s.size === spec.size);
      if (!stockEntry) continue;

      const availableQuantity = Math.min(spec.quantity, stockEntry.quantity);
      if (availableQuantity > 0) {
        stockEntry.quantity -= availableQuantity;
        await tyre.save();

        totalPrice += availableQuantity * stockEntry.price;

        approvedSpecs.push({
          tyreId: spec.tyreId,
          size: spec.size,
          quantity: availableQuantity,
          price: stockEntry.price,
          originallyRequested: spec.quantity,
        });
      }
    }

    if (approvedSpecs.length === 0) {
      return res.status(400).json({ error: "No tyres available for approval" });
    }

    req.tyreRequestData = {
      tyreRequest: await TyreRequest.create({
        userId,
        ShopId,
        comments,
        specification: approvedSpecs,
        price: totalPrice,
      }),
      approvedSpecs,
      totalPrice,
      pushtire,
      ShopId,
    };

    next();
  } catch (error) {
    console.error("Error in createTyreRequest:", error);
    res.status(500).json({ error: "Server error in request creation" });
  }
};

exports.handlePushTireUpdate = async (req, res, next) => {
  if (!req.tyreRequestData.pushtire) return next();

  try {
    const { tyreRequest, approvedSpecs, ShopId } = req.tyreRequestData;
    // console.log("shopId 11111",tyreRequest.ShopId )
    tyreRequest.status = "fitment-push";
    await tyreRequest.save();

    const shop = await Shop.findById(ShopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    for (const spec of approvedSpecs) {
      const stockIndex = shop.ShopStocks.findIndex(
        (item) => item.tyreId?.toString() === spec.tyreId.toString()
      );

      if (stockIndex !== -1) {
        const sizeIndex = shop.ShopStocks[stockIndex].sizes.findIndex(
          (s) => s.size === spec.size
        );

        if (sizeIndex !== -1) {
          const currentShopQuantity =
            shop.ShopStocks[stockIndex].sizes[sizeIndex].quantity;
          const neededQuantity = spec.originallyRequested - currentShopQuantity;

          if (neededQuantity > 0) {
            shop.ShopStocks[stockIndex].sizes[sizeIndex].quantity += Math.min(
              neededQuantity,
              spec.quantity
            );
          }
        } else {
          shop.ShopStocks[stockIndex].sizes.push({
            size: spec.size,
            quantity: spec.quantity,
            price: spec.price || 0,
          });
        }
      } else {
        shop.ShopStocks.push({
          tyreId: spec.tyreId,
          sizes: [
            {
              size: spec.size,
              quantity: spec.quantity,
              price: spec.price || 0,
            },
          ],
        });
      }
    }

    shop.orders.push({
      orderId: req.body.appointmentId,
      status: "pending",
    });

    if (!shop.TyresRequested.includes(tyreRequest._id)) {
      shop.TyresRequested.push(tyreRequest._id);
    }

    await shop.save();
    next();
  } catch (error) {
    console.error("Error in handlePushTireUpdate:", error);
    res.status(500).json({ error: "Server error in shop updates" });
  }
};

exports.handelreducetyes = async (req, res, next) => {
  try {
    const { ShopId, approvedSpecs } = req.tyreRequestData;
    console.log("approvedSpecs", approvedSpecs);

    const shop = await Shop.findById(ShopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    for (const spec of approvedSpecs) {
      const stockItem = shop.ShopStocks.find(
        (item) => item.tyreId?.toString() === spec.tyreId.toString()
      );

      if (stockItem) {
        const sizeItem = stockItem.sizes.find((s) => s.size === spec.size);
        if (sizeItem) {
          // Reduce the stock quantity
          sizeItem.quantity = Math.max(0, sizeItem.quantity - spec.quantity);
        }
      }
    }

    console.log("Updated ShopStocks", shop.ShopStocks);

    await shop.save();

    next();
  } catch (error) {
    console.error("Error in handlePushTireUpdate:", error);
    res.status(500).json({ error: "Server error in shop updates" });
  }
};

exports.updateOrderStatuses = async (req, res, next) => {
  try {
    const currentOrder = await clientOrder.findById(req.body.clientOrderId);
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    await clientOrder.findByIdAndUpdate(
      req.body.clientOrderId,
      {
        status: "Approved",
        totalPrice: currentOrder.totalPrice,
      },
      { new: true }
    );

    // Update appointment order status
    await Appointment.findByIdAndUpdate(
      req.body.appointmentId,
      { orderstatus: "Approved" },
      { new: true }
    );

    next(); // Proceed to final response
  } catch (error) {
    console.error("Error in updateOrderStatuses:", error);
    res.status(500).json({ error: "Server error in status updates" });
  }
};

exports.finalResponse = async (req, res) => {
  sendNotificationEmail(
    "Tyre Request Processed",
    `A tyre request has been processed successfully. Details: ${JSON.stringify(
      req.tyreRequestData.tyreRequest
    )}`
  );
  try {
    const { tyreRequest } = req.tyreRequestData;
    console.log("reached final response");
    res.status(201).json({
      message: "Tyre request processed successfully",
      data: {
        tyreRequest,
      },
    });
  } catch (error) {
    console.error("Error in finalResponse:", error);
    res.status(500).json({ error: "Server error in final response" });
  }
};
exports.updateTyreRequest = async (req, res) => {
  try {
    const tyreRequest = await TyreRequest.findById(req.params.id);
    if (!tyreRequest)
      return res.status(404).json({ error: "Tyre request not found" });

    const newStatus = req.params.status;
    tyreRequest.status = newStatus;

    // ✅ Step 2: If approved, update ShopStocks
    if (newStatus === "Approved") {
      const shop = await Shop.findById(tyreRequest.ShopId);
      if (!shop) return res.status(404).json({ error: "Shop not found" });

      for (const spec of tyreRequest.specification) {
        const stockIndex = shop.ShopStocks.findIndex(
          (item) => item.tyreId?.toString() === spec.tyreId.toString()
        );

        if (stockIndex !== -1) {
          // TyreId exists
          const sizeIndex = shop.ShopStocks[stockIndex].sizes.findIndex(
            (s) => s.size === spec.size
          );

          if (sizeIndex !== -1) {
            // ✅ Size exists → update quantity
            shop.ShopStocks[stockIndex].sizes[sizeIndex].quantity +=
              spec.quantity;
          } else {
            // ✅ Size doesn't exist → add size
            shop.ShopStocks[stockIndex].sizes.push({
              size: spec.size,
              quantity: spec.quantity,
              price: spec.price || 0,
            });
          }
        } else {
          // TyreId doesn't exist → create new entry
          shop.ShopStocks.push({
            tyreId: spec.tyreId,
            sizes: [
              {
                size: spec.size,
                quantity: spec.quantity,
                price: spec.price || 0,
              },
            ],
          });
        }
      }

      await shop.save();
    }

    await tyreRequest.save();

    res
      .status(200)
      .json({ message: "Tyre request updated", data: tyreRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
};
