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
router.post("/addvehicle", createVehicle);

// Get all vehicles
router.get("/getallvehicles", getAllVehicles);

// Get vehicle by ID
router.get("/getvehiclebyid/:id", getVehicleById);

// Update vehicle by ID
router.put("/updatevehicle/:id", updateVehicle);

// Delete vehicle by ID
router.delete("/deletevehicle/:id", deleteVehicle);

module.exports = router;
