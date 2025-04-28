const express = require("express");
const {
  createMapping,
  getAllMappings,
  getMappingById,
  getMappingsByShopId,
  deleteMapping,
} = require("../../Controllers/admin/Mapping.controller");

const router = express.Router();

// Create a new mapping
router.post("/", createMapping);

// Get all mappings
router.get("/", getAllMappings);

// Get a single mapping by ID
router.get("/:id", getMappingById);

// Get mappings by specific shopId
router.get("/shop/:shopId", getMappingsByShopId);

// Delete a mapping
router.delete("/:id", deleteMapping);

module.exports = router;
