const express = require("express");
const {
  createTyre,
  getAllTyres,
  getTyreById,
  updateTyre,
  deleteTyre,
  AddNewStocks,
  getAllTyresFormWebPannels,
} = require("../../Controllers/admin/Addtyre.controller");

const router = express.Router();

// Create a new tyre
router.post("/", createTyre);
router.post("/edit", AddNewStocks);
router.get("/", getAllTyres);
router.get("/webpannels", getAllTyresFormWebPannels);
router.get("/:id", getTyreById);
router.put("/:id", updateTyre);
router.delete("/:id", deleteTyre);


module.exports = router;
