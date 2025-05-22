const express = require("express");
const router = express.Router();
const {
  getLast30DaysRevenue,
  getLast6MonthsRevenue,
  getLast12MonthsRevenue,
  getOverallRevenue,
} = require("../../../Controllers/admin/summary/TyreReplacementReport.controller");

// Revenue report routes
router.get("/revenue/last-30-days", getLast30DaysRevenue);
router.get("/revenue/last-6-months", getLast6MonthsRevenue);
router.get("/revenue/last-12-months", getLast12MonthsRevenue);
router.get("/revenue/overall", getOverallRevenue);

module.exports = router;
