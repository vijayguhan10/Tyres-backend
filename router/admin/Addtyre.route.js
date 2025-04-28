const express = require("express");
const {
  createTyre,
  getAllTyres,
  getTyreById,
  updateTyre,
  deleteTyre,
} = require("../../Controllers/admin/Addtyre.controller");

const router = express.Router();

// Create a new tyre
router.post("/", createTyre);

// Get all tyres
router.get("/", getAllTyres);

// Get a single tyre by ID
router.get("/:id", getTyreById);

// Update a tyre
router.put("/:id", updateTyre);

// Delete a tyre
router.delete("/:id", deleteTyre);

module.exports = router;
