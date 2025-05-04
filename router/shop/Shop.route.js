const express = require("express");
const router = express.Router();
const { createShop, getShopByUserId, updateShop,getAllShops } = require("../../Controllers/shop/CreateShop.Controller");
router.post("/create-shops", createShop); 
router.get("/getshopbyid", getShopByUserId); 
router.put("/updateshop", updateShop); 
router.get("/shops", getAllShops); 
module.exports = router;
