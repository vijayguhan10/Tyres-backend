const express = require("express");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../../Controllers/client/AddVehicle.controller");

const router = express.Router();

// Create a new vehicle
router.post("/", createVehicle);

// Get all vehicles
router.get("/", getAllVehicles);

// Get vehicle by ID
router.get("/:id", getVehicleById);

// Update vehicle by ID
router.put("/:id", updateVehicle);

// Delete vehicle by ID
router.delete("/:id", deleteVehicle);

module.exports = router;
