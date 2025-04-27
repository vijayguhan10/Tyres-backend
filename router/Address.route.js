const express = require("express");
const router = express.Router();
const {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../Controllers/Address.controller");
const { authenticateJWT } = require("../Controllers/User.controller");

router.post("/create", authenticateJWT, createAddress);
router.get("/getall", authenticateJWT, getAllAddresses);
router.get("/:id", authenticateJWT, getAddressById);
router.put("/:id", authenticateJWT, updateAddress);
router.delete("/:id", authenticateJWT, deleteAddress);
module.exports = router;
