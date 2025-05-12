const express = require("express");
const router = express.Router();
const ordercontroller = require("../../Controllers/shop/Tyres.controller");

router.post("/createorder", ordercontroller.createTyreRequest);
// router.get("/getorder", ordercontroller.);
router.get("/getindividual:id", ordercontroller.getTyreRequestById);
router.put("/updte:id", ordercontroller.updateTyreRequest);
router.delete("/delete:id", ordercontroller.deleteTyreRequest);
router.get("/getall", ordercontroller.getTyreInfo);
module.exports = router;
