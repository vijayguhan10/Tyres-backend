const express = require("express");

const {
  getOrderSummaryByShop,
} = require("../../Controllers/admin/OrderSummaryByShop.controller");

const router = express.Router();

router.get("/order-summary-by-shop", getOrderSummaryByShop);

module.exports = router;