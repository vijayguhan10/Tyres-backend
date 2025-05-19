const express = require("express");
const router = express.Router();
const Carwash = require("../../Controllers/client/Clientcarwash.controller");
router.post("/getlocation", Carwash.getNearbyCarwashShops);
router.post("/addreview/:shopId", Carwash.postReviewToShop);
router.post("/postorders/:shopId", Carwash.placeOrderToShop);

module.exports = router;
