const express = require("express");
const router = express.Router();
const OwnCustomerController = require("../../Controllers/shop/Owncustomers.controller");

// Create or update a customer (add order to orderHistory if exists)
router.post("/", OwnCustomerController.createOrUpdateOwnCustomer);

// Get all customers
router.get("/", OwnCustomerController.getAllOwnCustomers);

// Get customer by ID
router.get("/:id", OwnCustomerController.getOwnCustomerById);

// Update customer by ID
router.put("/:id", OwnCustomerController.updateOwnCustomer);

// Delete customer by ID
router.delete("/:id", OwnCustomerController.deleteOwnCustomer);

module.exports = router;