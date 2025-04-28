const TyreInfo = require("../../Models/client/OrderTyre");
const { verifyToken } = require("../../Auth/auth");

const createTyreInfo = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });
  console.log("request body for ordering tyres : ", req.body);
  try {
    const decoded = await verifyToken(token);
    if (decoded.role !== "client") {
      return res
        .status(403)
        .json({ message: "Only clients can add tyre info" });
    }

    const newTyreInfo = new TyreInfo({
      userId: decoded.userId,
      tyreinfo: req.body.tyreinfo,
      status: req.body.status || "Pending",
    });

    const savedTyreInfo = await newTyreInfo.save();
    res.status(201).json(savedTyreInfo);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getTyreInfos = async (req, res) => {
  try {
    const tyreInfos = await TyreInfo.find()
      .populate("userId", "name email")
      .populate("tyreinfo");
    res.status(200).json(tyreInfos);
  } catch (error) {
    console.log("error : ",error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getTyreInfoById = async (req, res) => {
  try {
    console.log("order id individual : ", req.params.id);
    const tyreInfo = await TyreInfo.findById(req.params.id)
      .populate("userId", "name email")
      .populate("tyreinfo");

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre info not found" });
    }

    res.status(200).json(tyreInfo);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTyreInfo = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = await verifyToken(token);
    const tyreInfo = await TyreInfo.findById(req.params.id);

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre info not found" });
    }

    if (tyreInfo.userId.toString() !== decoded.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    tyreInfo.status = req.body.status || tyreInfo.status;

    const updatedTyreInfo = await tyreInfo.save();
    res.status(200).json(updatedTyreInfo);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTyreInfo = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = await verifyToken(token);
    const tyreInfo = await TyreInfo.findById(req.params.id);

    if (!tyreInfo) {
      return res.status(404).json({ message: "Tyre info not found" });
    }

    if (tyreInfo.userId.toString() !== decoded.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    tyreInfo.deleted = true;
    await tyreInfo.save();

    res
      .status(200)
      .json({ message: "Tyre info marked as deleted successfully" });
  } catch (error) {
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
