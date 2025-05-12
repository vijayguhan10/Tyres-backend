const express = require("express");
const router = express.Router();
const TyreRequest = require("../../Controllers/admin/TyreRequests.controller");
router.get("/getallrequests", TyreRequest.getTyreRequestsByStatus);
router.post("/assigntyres", TyreRequest.AssignTyres);
module.exports = router;