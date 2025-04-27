const express = require("express");
const {
  createTyreInfo,
  getTyreInfos,
  getTyreInfoById,
  updateTyreInfo,
  deleteTyreInfo,
} = require("../../Controllers/client/OrderTyre.controller");
const router = express.Router();
const { authenticateJWT } = require("../../Controllers/User.controller");
router.post("/ordertyre", authenticateJWT, createTyreInfo);
router.get("/orderinfo", authenticateJWT, getTyreInfos);
router.get("/orderinfo/:id", authenticateJWT, getTyreInfoById);
router.put("/orderinfo/:id", authenticateJWT, updateTyreInfo);
router.delete("/orderinfo/:id", authenticateJWT, deleteTyreInfo);
module.exports = router;
