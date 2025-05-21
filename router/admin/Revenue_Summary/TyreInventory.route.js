const express = require("express");
const router = express.Router();
const {
  getTyreRevenueSummary,
} = require("../../../Controllers/admin/Revenue_Summary/TyreInventory.controller");

// Get revenue summary for the shop (using JWT token)
router.get("/", getTyreRevenueSummary);

module.exports = router;
