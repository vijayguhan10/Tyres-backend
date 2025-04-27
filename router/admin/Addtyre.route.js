const express = require("express");
const {
  createTyre,
  getAllTyres,
  getTyreById,
  updateTyre,
  deleteTyre,
} = require("../../Controllers/admin/Addtyre.controller");
const { authenticateJWT } = require("../../Controllers/User.controller");

const router = express.Router();

// Create a new tyre
router.post("/", authenticateJWT, createTyre);

// Get all tyres
router.get("/", authenticateJWT, getAllTyres);

// Get a single tyre by ID
router.get("/:id", authenticateJWT,  getTyreById);

// Update a tyre
router.put("/:id", authenticateJWT, updateTyre);

// Delete a tyre
router.delete("/:id", authenticateJWT, deleteTyre);

module.exports = router;
