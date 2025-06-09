const Shop = require("../../Models/shop/Shop");
const TyreRequest = require("../../Models/shop/RequestTyres");
const Tyres = require("../../Models/admin/Addtyre");
exports.createTyreRequest = async (req, res) => {
  console.log("createTyreRequest", req.body);
  try {
    const {userId} = req.user;
    
    // Find shop by userId instead of ShopId
    const shop = await Shop.findOne({ userId: userId });
    if (!shop) {
      return res.status(404).json({ error: "Shop not found for this user" });
    }

    // Create tyre request with shop's ID
    const tyreRequestData = {
      userId,
      ...req.body,
      ShopId: shop._id // Ensure ShopId is set from found shop
    };
    
    const tyreRequest = await TyreRequest.create(tyreRequestData);
    
    // Update shop's TyresRequested array
    shop.TyresRequested.push(tyreRequest._id);
    await shop.save();

    res.status(201).json({ 
      message: "Tyre request created", 
      data: tyreRequest 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getTyreRequestById = async (req, res) => {
  try {
    const request = await TyreRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: "Error fetching request" });
  }
};

exports.updateTyreRequest = async (req, res) => {
  try {
    const tyreRequest = await TyreRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tyreRequest)
      return res.status(404).json({ error: "Tyre request not found" });
    res
      .status(200)
      .json({ message: "Tyre request updated", data: tyreRequest });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteTyreRequest = async (req, res) => {
  try {
    const request = await TyreRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    await Shop.findByIdAndUpdate(request.ShopId, {
      $pull: { TyresRequested: request._id },
    });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting request" });
  }
};
exports. getTyreInfo = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";
    console.log("Search query:", search);
    let query = { deleted: { $ne: true } };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { _id: mongoose.Types.ObjectId.isValid(search) ? search : undefined },
        { "stock.size": searchRegex },
      ].filter(Boolean); 
    }

    const tyres = await Tyres.find(query).skip(skip).limit(limit);
    const total = await Tyres.countDocuments(query);

    res.status(200).json({
      message: "All tyres fetched successfully",
      data: tyres,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

