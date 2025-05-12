const express = require("express");
const router = express.Router();
const { createShop, getShopByUserId, updateShop,getAllShops ,GetShopStocks,GetOrdersAssigned} = require("../../Controllers/shop/Partnershop.Controller");
router.post("/create-shops", createShop); 
router.get("/getshopbyid", getShopByUserId); 
router.put("/updateshop", updateShop); 
router.get("/shops", getAllShops); 
router.get("/getshopstocks",GetShopStocks)
router.get("/getorders",GetOrdersAssigned)
module.exports = router;
