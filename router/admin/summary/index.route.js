const express = require("express");
const router = express.Router();
const tyreReplacementReportRoutes = require("./TyreReplacementReport.route");

// Mount the TyreReplacementReport routes
router.use("/tyre-replacement", tyreReplacementReportRoutes);

module.exports = router;
