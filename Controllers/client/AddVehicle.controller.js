const AddVehicle = require("../../Models/client/AddVehicle");

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, vehicleType, vehicleModel } = req.body;
    const { userId } = req.user;

    const newVehicle = new AddVehicle({
      userId,
      registrationNumber,
      vehicleType,
      vehicleModel,
      servicesDone: 0,
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const { userId } = req.user;
    const vehicles = await AddVehicle.find({ userId });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { userId } = req.user;
    const vehicle = await AddVehicle.findOne({ _id: req.params.id, userId });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a vehicle
const updateVehicle = async (req, res) => {
  try {
    const { registrationNumber, vehicleType, vehicleModel, servicesDone } = req.body;
    const { userId } = req.user;
    const updatedVehicle = await AddVehicle.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        ...(registrationNumber && { registrationNumber }),
        ...(vehicleType && { vehicleType }),
        ...(vehicleModel && { vehicleModel }),
        ...(servicesDone !== undefined && { servicesDone }),
      },
      { new: true, runValidators: true }
    );
    if (!updatedVehicle)
      return res.status(404).json({ error: "Vehicle not found" });
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { userId } = req.user;
    const deletedVehicle = await AddVehicle.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedVehicle)
      return res.status(404).json({ error: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
