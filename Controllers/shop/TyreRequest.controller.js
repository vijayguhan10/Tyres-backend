const TyreRequest = require("../../Models/shop/RequestTyres");
const Tyre = require("../../Models/admin/Addtyre");
const Shop = require("../../Models/shop/Shop");

// Create Tyre Request (Updated without brand field)
exports.createTyreRequest = async (req, res) => {
  console.log(req.body); // Add this line to log the request body
  try {
    const { userId, ShopId, comments, specification } = req.body;

    let totalPrice = 0;
    const tyreBrands = new Set(); // To capture all unique brands

    for (const spec of specification) {
      const tyre = await Tyre.findById(spec.tyreId);
      if (!tyre) {
        return res.status(404).json({ error: `Tyre with ID ${spec.tyreId} not found` });
      }

      tyreBrands.add(tyre.brand);

      const stockEntry = tyre.stock.find((s) => s.size === spec.size);
      if (!stockEntry || stockEntry.quantity < spec.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for size ${spec.size} in tyre ${tyre.model}`,
        });
      }

      // Deduct stock quantity
      stockEntry.quantity -= spec.quantity;

      await tyre.save();

      // Calculate total price
      totalPrice += spec.quantity * stockEntry.price;
    }

    const tyreRequest = await TyreRequest.create({
      userId,
      ShopId,
      comments,
      specification,
      price: totalPrice,
    });

    // Update the shop with the new request
    await Shop.findByIdAndUpdate(ShopId, {
      $push: { TyresRequested: tyreRequest._id },
    });

    res.status(201).json({ message: "Tyre request created", data: tyreRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating tyre request" });
  }
};

// Get All Tyre Requests (Admin or Global View)
exports.getAllTyreRequests = async (req, res) => {
  try {
    const requests = await TyreRequest.find()
      .populate("userId", "name")
      .populate("ShopId", "name");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tyre requests" });
  }
};

// Get Single Tyre Request
exports.getTyreRequestById = async (req, res) => {
  try {
    const request = await TyreRequest.findById(req.params.id)
      .populate("userId", "name")
      .populate("ShopId", "name");

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: "Error fetching request" });
  }
};

// Update Tyre Request (Status/comments/deleterequest)
exports.updateTyreRequest = async (req, res) => {
  try {
    const updateFields = req.body;
    const updated = await TyreRequest.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Tyre request not found" });

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete Tyre Request
exports.deleteTyreRequest = async (req, res) => {
  try {
    const request = await TyreRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Remove from Shop's TyresRequested array
    await Shop.findByIdAndUpdate(request.ShopId, {
      $pull: { TyresRequested: request._id },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting request" });
  }
};
