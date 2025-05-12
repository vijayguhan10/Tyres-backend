const express = require("express");
const router = express.Router();
const {
  createShop,
  getShopByUserId,
  updateShop,
  getAllShops,
  GetShopStocks,
  GetOrdersAssigned,
  getshopmetadata,
  completeorder,
  getrequestedtyresall
} = require("../../Controllers/shop/Partnershop.Controller");
router.post("/create-shops", createShop);
router.get("/getshopbyid", getShopByUserId);
router.put("/updateshop", updateShop);
router.get("/shops", getAllShops);
router.get("/getshopstocks", GetShopStocks);
router.get("/getorders", GetOrdersAssigned);
router.get("/getmetadata", getshopmetadata);
router.post("/completeorder", completeorder);
router.get("/requestedtyres-all", getrequestedtyresall);
module.exports = router;
