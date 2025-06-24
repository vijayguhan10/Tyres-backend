const express = require("express");
const router = express.Router();
const tyreRequestController = require("../../Controllers/admin/AssignOrder.controller");

router.post(
  "/adminassign/increasetyres",
  tyreRequestController.createTyreRequest,
  tyreRequestController.handlePushTireUpdate, 
  tyreRequestController.handelreducetyes, 

  tyreRequestController.updateOrderStatuses, 
  tyreRequestController.finalResponse 
);
router.post(
  "/adminassign/reducetyres",
  async (req, res, next) => {
    try {
      const { ShopId, specification, appointmentId, clientOrderId } = req.body;

      // Validate required fields
      if (!ShopId || !specification || !appointmentId || !clientOrderId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Prepare data for reduction
      req.tyreRequestData = {
        ShopId,
        approvedSpecs: specification,
        appointmentId,
        clientOrderId,
      };

      next();
    } catch (error) {
      console.error("Error in reduction setup:", error);
      res.status(500).json({ error: "Server error in reduction setup" });
    }
  },
  tyreRequestController.handelreducetyes,
  tyreRequestController.updateOrderStatuses,
  tyreRequestController.finalResponse
);
router.put("/update/:id/:status", tyreRequestController.updateTyreRequest);


module.exports = router;
