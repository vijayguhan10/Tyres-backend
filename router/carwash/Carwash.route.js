const express = require("express");
const router = express.Router();
const Carwash = require("../../Controllers/Carwash/Carwash.controller");
const { authenticateJWT } = require("../../Controllers/User.controller");

// Create a new shop

// Get all shops

// Get a shop by ID
// router.get("/:id", Carwash.getShopById);

// Add a new order to a sh
router.post("/order", Carwash.addOrderToShop);
router.get("/getall", authenticateJWT, Carwash.getAllOrdersForShop);
// Change the status of an order in a shop
router.patch("/order/status", Carwash.changeOrderStatus);
router.post("/addreview/:shopId", authenticateJWT, Carwash.postReviewToShop);
router.post("/postorders/:shopId", authenticateJWT, Carwash.placeOrderToShop);
module.exports = router;
