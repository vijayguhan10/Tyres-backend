const express = require("express");
const router = express.Router();
const {
  createTyreRequest,
  getTyreRequests,
  getTyreRequestById,
  updateTyreRequest,
  deleteTyreRequest,
} = require("../../Controllers/shop/RequestTyres.controller");
const { rolecheck } = require("../../Utils/Role");
const { authenticateJWT } = require("../../Controllers/User.controller");

router.post("/create-tyre-request", createTyreRequest);

router.get("/get-all-tyre-requests", getTyreRequests);
router.get("/get-tyre-request/:id", getTyreRequestById);
router.put("/update-tyre-request/:id", updateTyreRequest);
router.put("/delete-tyre-request/:id", deleteTyreRequest);

module.exports = router;
