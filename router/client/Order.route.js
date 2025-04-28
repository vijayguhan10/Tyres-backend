const express = require("express");
const {
  createTyreInfo,
  getTyreInfos,
  getTyreInfoById,
  updateTyreInfo,
  deleteTyreInfo,
} = require("../../Controllers/client/OrderTyre.controller");
const router = express.Router();

router.post("/ordertyre", createTyreInfo);
router.get("/orderinfo", getTyreInfos);
router.get("/orderinfo/:id", getTyreInfoById);
router.put("/orderinfo/:id", updateTyreInfo);
router.delete("/orderinfo/:id", deleteTyreInfo);
module.exports = router;
