const Shop = require("../../Models/shop/Shop");
const TyreRequest = require("../../Models/shop/RequestTyres");
const Tyres = require("../../Models/admin/Addtyre");
exports.createTyreRequest = async (req, res) => {
  console.log("createTyreRequest", req.body);
  try {
    const { ShopId } = req.body;
    // Validate ShopId
    const shop = await Shop.findById(ShopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    const tyreRequest = await TyreRequest.create(req.body);
    shop.TyresRequested.push(tyreRequest._id);
    await shop.save();
    res
      .status(201)
      .json({ message: "Tyre request created", data: tyreRequest });
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
exports.getTyreInfo = async (req, res) => {
  try {
    const Alltyres = await Tyres.find().lean();
    console.log("Alltyres", Alltyres);
    if (!Alltyres) return res.status(404).json({ error: "Tyre not found" });
    res.status(200).json(Alltyres);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tyre" });
  }
};
