const TyreRequest = require("../../Models/shop/RequestTyres");
const createTyreRequest = async (req, res) => {
  const { tyreBrand, size, quantity, comments } = req.body;

  try {
    const newRequest = new TyreRequest({
      userId: req.user.userId,
      tyreBrand,
      size,
      quantity,
      comments,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getTyreRequests = async (req, res) => {
  try {
    const tyreRequests = await TyreRequest.find({ userId: req.user.userId });
    res.status(200).json(tyreRequests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTyreRequest = async (req, res) => {
  const { tyreBrand, size, quantity, comments } = req.body;

  try {
    const tyreRequest = await TyreRequest.findById(req.params.id);
    if (!tyreRequest) {
      return res.status(404).json({ message: "Tyre request not found" });
    }

    if (tyreRequest.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    tyreRequest.tyreBrand = tyreBrand || tyreRequest.tyreBrand;
    tyreRequest.size = size || tyreRequest.size;
    tyreRequest.quantity = quantity || tyreRequest.quantity;
    tyreRequest.comments = comments || tyreRequest.comments;

    const updatedRequest = await tyreRequest.save();
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTyreRequest = async (req, res) => {
  try {
    const tyreRequest = await TyreRequest.findById(req.params.id);
    if (!tyreRequest) {
      return res.status(404).json({ message: "Tyre request not found" });
    }

    if (tyreRequest.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (tyreRequest.status == "pending") {
      tyreRequest.deleterequest = true;
    } else {
      return res.status(400).json({ message: "Delete request not valid" });
    }
    const updatedRequest = await tyreRequest.save();
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTyreRequest,
  getTyreRequests,
  getTyreRequestById,
  updateTyreRequest,
  deleteTyreRequest,
};
