const express = require("express");
const {getShopsWithDistance}=require("../../Controllers/admin/AsignOrders.controller")
const router = express.Router();
router.post("/filter",getShopsWithDistance)
module.exports = router;