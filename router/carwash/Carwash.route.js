const express = require("express");
const router = express.Router();
const Carwash = require("../../Controllers/Carwash/Carwash.controller");

// Create a new shop
router.post("/", Carwash.createShop);

// Get all shops
router.get("/", Carwash.getAllShops);

// Get a shop by ID
router.get("/:id", Carwash.getShopById);

// Update a shop by ID
router.put("/:id", Carwash.updateShop);

// Delete a shop by ID
router.delete("/:id", Carwash.deleteShop);

// Add a new order to a shop
router.post("/order", Carwash.addOrderToShop);

// Change the status of an order in a shop
router.patch("/order/status", Carwash.changeOrderStatus);

module.exports = router;
