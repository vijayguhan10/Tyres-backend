const express = require("express");
const router = express.Router();
const controller = require("../../Controllers/client/Clientcarwashdata.controller");

// CRUD routes
router.post("/", controller.createClientCarwash);
router.get("/", controller.getAllClientCarwash);
router.get("/:id", controller.getClientCarwashById);
router.put("/:id", controller.updateClientCarwash);
router.delete("/:id", controller.deleteClientCarwash);

router.post("/getlocation", controller.getNearbyCarwashShops);
router.put("/review/:orderid", controller.addOrUpdateReview);

module.exports = router;
