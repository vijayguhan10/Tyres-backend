const TyreRequest = require("../../Models/shop/RequestTyres");
// const Shop = require("../models/Shop");

const createTyreRequest = async (req, res) => {
  try {
    const { ShopId, brand, model, type, vehicleType, specification, price } =
      req.body;
    const tyreRequest = new TyreRequest({
      userId: req.user.userId,
      ShopId,
      brand,
      model,
      type,
      vehicleType,
      specification,
      price,
      status: "Pending",
      deleterequest: false,
    });

    await tyreRequest.save();
    res
      .status(201)
      .json({ message: "Tyre request created successfully", tyreRequest });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
const getTyreRequestById = async (req, res) => {
  try {
    const tyreRequest = await TyreRequest.findById(req.params.id);

    if (!tyreRequest) {
      return res.status(404).json({ message: "Tyre request not found" });
    }

    res.status(200).json(tyreRequest);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
const updateTyreRequest = async (req, res) => {
  try {
    const tyreRequest = await TyreRequest.findById(req.params.id);

    if (!tyreRequest) {
      return res.status(404).json({ message: "Tyre request not found" });
    }

    if (tyreRequest.status !== "Pending") {
      return res.status(400).json({
        message: "Cannot update the tyre request as the status is not Pending",
      });
    }

    if (tyreRequest.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this tyre request",
      });
    }
    const { brand, model, type, vehicleType, specification, price } = req.body;
    console.log("request body to edit : ",req.body);
    tyreRequest.brand = brand || tyreRequest.brand;
    tyreRequest.model = model || tyreRequest.model;
    tyreRequest.type = type || tyreRequest.type;
    tyreRequest.vehicleType = vehicleType || tyreRequest.vehicleType;
    tyreRequest.specification = specification || tyreRequest.specification;
    tyreRequest.price = price || tyreRequest.price;
    const updatedTyreRequest = await tyreRequest.save();
    res.status(200).json({
      message: "Tyre request updated successfully",
      updatedTyreRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteTyreRequest = async (req, res) => {
  try {
    const tyreRequest = await TyreRequest.findById(req.params.id);

    if (!tyreRequest) {
      return res.status(404).json({ message: "Tyre request not found" });
    }

    if (tyreRequest.status !== "Pending") {
      return res.status(400).json({
        message: "Cannot delete the tyre request as the status is not Pending",
      });
    }

    if (tyreRequest.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this tyre request",
      });
    }

    await tyreRequest.remove();
    res.status(200).json({ message: "Tyre request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getTyreRequestsByUser = async (req, res) => {
  try {
    const tyreRequests = await TyreRequest.find({ userId: req.user.userId });

    if (tyreRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No tyre requests found for this user" });
    }

    res.status(200).json(tyreRequests);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getTyreRequestsByShop = async (req, res) => {
  try {
    const tyreRequests = await TyreRequest.find({ ShopId: req.params.shopId }).populate("ShopId");

    if (tyreRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No tyre requests found for this shop" });
    }

    res.status(200).json(tyreRequests);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createTyreRequest,
  getTyreRequestById,
  updateTyreRequest,
  deleteTyreRequest,
  getTyreRequestsByUser,
  getTyreRequestsByShop,
};
