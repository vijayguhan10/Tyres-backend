const express = require("express");
const router = express.Router();
const Carwash = require("./Carwash.route")
router.use("/carwash", Carwash)

module.exports = router;