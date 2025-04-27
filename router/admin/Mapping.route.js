const express = require("express");
const {
  createMapping,
  getAllMappings,
  getMappingById,
  getMappingsByShopId,
  deleteMapping,
} = require("../../Controllers/admin/Mapping.controller");
const { authenticateJWT } = require("../../Controllers/User.controller");

const router = express.Router();

// Create a new mapping
router.post("/", authenticateJWT, createMapping);

// Get all mappings
router.get("/", authenticateJWT, getAllMappings);

// Get a single mapping by ID
router.get("/:id", authenticateJWT, getMappingById);

// Get mappings by specific shopId
router.get("/shop/:shopId", authenticateJWT, getMappingsByShopId);

// Delete a mapping
router.delete("/:id", authenticateJWT, deleteMapping);

module.exports = router;
