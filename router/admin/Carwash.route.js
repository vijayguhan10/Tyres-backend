const express = require("express");
const router = express.Router();
const Carwash = require("../../Controllers/admin/Carwash.controller");
router.post("/add", Carwash.createShop
);
router.get("/getallshops", Carwash.getAllShops);
router.get("/get/:id", Carwash.getShopById);
router.get("/summary", Carwash.getCarwashSummaryByShop);
router.put("/update/:id", Carwash.updateShop);
router.delete("/delete/:id", Carwash.deleteShop);

module.exports = router;
