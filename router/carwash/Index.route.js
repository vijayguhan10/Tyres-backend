const express = require("express");
const router = express.Router();
const Carwash = require("./Carwash.route")
const { authenticateJWT } = require("../../Controllers/User.controller");
router.use("/carwash", Carwash)

module.exports = router;