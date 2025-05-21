const OwnCustomer = require("../../Models/shop/Owncustomers");
const Shops = require("../../Models/shop/Shop");
const createOrUpdateOwnCustomer = async (req, res) => {
  try {
    const {
      name,
      addressProof,
      pincode,
      address,
      phoneNumber,
      vehicleNumber,
      orderHistory, // This should be an object with items, totalAmount, etc.
    } = req.body;

    // Basic validation
    console.log("Received data:", req.body);
    if (!name || !addressProof || !pincode || !address || !phoneNumber || !orderHistory || !orderHistory.items) {
      console.log("Validation failed");

      return res.status(400).json({ message: "All fields are required" });
    }

    // Find existing customer
    let customer = await OwnCustomer.findOne({ name, phoneNumber });

    if (customer) {
      // Append new order (with items array) to order history
      customer.orderHistory.push({
        items: orderHistory.items, // expects array of items
        totalAmount: orderHistory.totalAmount,
        orderDate: orderHistory.orderDate || Date.now(),
      });
      await customer.save();
      return res.status(200).json({
        message: "Order added to existing customer",
        customer,
      });
    }

    // Create new customer
    const newCustomer = new OwnCustomer({
      name,
      addressProof,
      pincode,
      address,
      phoneNumber,
      vehicleNumber,
      orderHistory: [{
        items: orderHistory.items,
        totalAmount: orderHistory.totalAmount,
        orderDate: orderHistory.orderDate || Date.now(),
      }],
    });

    await newCustomer.save();

    // Link customer to shop
    const { userId } = req.user;
    const shop = await Shops.findOne({ userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    shop.OwnCustomers.push(newCustomer._id);
    await shop.save();

    return res.status(201).json({
      message: "Customer created and linked to shop",
      customer: newCustomer,
    });

  } catch (error) {
    console.error("Error creating/updating customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getAllOwnCustomers = async (req, res) => {
  try {
    const customers = await OwnCustomer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer by ID
const getOwnCustomerById = async (req, res) => {
  try {
    const customer = await OwnCustomer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer by ID
const updateOwnCustomer = async (req, res) => {
  try {
    const customer = await OwnCustomer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete customer by ID
const deleteOwnCustomer = async (req, res) => {
  try {
    const customer = await OwnCustomer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateOwnCustomer,
  getAllOwnCustomers,
  getOwnCustomerById,
  updateOwnCustomer,
  deleteOwnCustomer,
};
