const express = require("express");
const router = express.Router();
const {
  createTyreRequest,
  getTyreRequests,
  getTyreRequestById,
  updateTyreRequest,
  deleteTyreRequest,
} = require("../../Controllers/shop/RequestTyres.controller");


router.post("/create-tyre-request", createTyreRequest);
router.get("/getalltyres", getTyreRequests);
router.get("/get-tyre-request/:id", getTyreRequestById);
router.put("/update-tyre-request/:id", updateTyreRequest);
router.delete("/delete-request/:id", deleteTyreRequest);

module.exports = router;
