const express = require("express");
const router = express.Router();
const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../../Controllers/shop/ShopAddress.controller");
const { rolecheck } = require("../../Utils/Role");
const { authenticateJWT } = require("../../Controllers/User.controller");
router.post("/create-address", createAddress);
router.get("/get-all-shop-address", getAddresses);
router.get("/get-individual-address/:id", getAddressById);
router.put("/updateaddress/:id", updateAddress);
router.delete("/deleteaddress/:id", deleteAddress);
module.exports = router;
