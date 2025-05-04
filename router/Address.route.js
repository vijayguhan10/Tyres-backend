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
const { rolecheck } = require("../Utils/Role");

router.post("/create", authenticateJWT, rolecheck("client"), createAddress);
router.get("/getall", authenticateJWT, rolecheck("client"), getAllAddresses);
router.get("/:id", authenticateJWT, rolecheck("client"), getAddressById);
router.put("/:id", authenticateJWT, rolecheck("client"), updateAddress);
router.delete("/:id", authenticateJWT, rolecheck("client"), deleteAddress);
module.exports = router;
