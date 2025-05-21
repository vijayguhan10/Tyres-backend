const express = require("express");
const router = express.Router();
const tyreInventoryRoutes = require("./TyreInventory.route");

// Mount TyreInventory routes
router.use("/tyre-inventory", tyreInventoryRoutes);

module.exports = router;
