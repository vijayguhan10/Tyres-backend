const express = require("express");
const router = express.Router();
const tyreRequestController = require("../../Controllers/shop/TyreRequest.controller");

router.post("/order", tyreRequestController.createTyreRequest);
router.get("/getall", tyreRequestController.getAllTyreRequests);
router.get("/getindi:id", tyreRequestController.getTyreRequestById);
router.put("/update:id", tyreRequestController.updateTyreRequest);
router.delete("/delete:id", tyreRequestController.deleteTyreRequest);

module.exports = router;
