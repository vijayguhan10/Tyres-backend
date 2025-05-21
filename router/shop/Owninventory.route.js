const express = require("express");
const router = express.Router();
const OwnInventoryController = require("../../Controllers/shop/Owninventory.controller");

// Create inventory and add to shop
router.post("/", OwnInventoryController.createOwnInventory);

// Get all inventories
router.get("/getall", OwnInventoryController.getAllOwnInventory);

// Get inventory by ID
router.get("/:id", OwnInventoryController.getOwnInventoryById);

// Update inventory by ID
router.put("/:id", OwnInventoryController.updateOwnInventory);

// Delete inventory by ID
router.delete("/:id", OwnInventoryController.deleteOwnInventory);

module.exports = router;