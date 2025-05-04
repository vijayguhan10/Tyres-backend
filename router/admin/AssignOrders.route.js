const express = require("express");
const {
  addOrderToShop,
  addTyreRequestToShop,
} = require("../../Controllers/admin/AsignOrders.controller");
const router = express.Router();
router.post("/shop/add-order", addOrderToShop);
router.post("/shop/add-tyrerequest", addTyreRequestToShop);
module.exports = router;
