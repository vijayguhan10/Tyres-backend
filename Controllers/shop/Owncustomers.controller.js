const OwnCustomer = require("../../Models/shop/Owncustomers");

// Create or update customer (add order to orderHistory if exists)
const createOrUpdateOwnCustomer = async (req, res) => {
  try {
    const {
      name,
      addressProof,
      pincode,
      address,
      phoneNumber,
      vehicleNumber,
      orderHistory, 
    } = req.body;

    if (
      !name ||
      !addressProof ||
      !pincode ||
      !address ||
      !phoneNumber ||
      !orderHistory
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find customer by name and vehicleNumber (adjust as needed)
    let customer = await OwnCustomer.findOne({ name, phoneNumber });

    if (customer) {
      // Add new order to orderHistory array
      customer.orderHistory.push(orderHistory);
      await customer.save();
      return res
        .status(200)
        .json({ message: "Order added to existing customer", customer });
    } else {
      // Create new customer
      const newCustomer = new OwnCustomer({
        name,
        addressProof,
        pincode,
        phoneNumber,
        address,
        vehicleNumber,
        orderHistory: [orderHistory],
      });
      await newCustomer.save();
      return res
        .status(201)
        .json({ message: "Customer created", customer: newCustomer });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all customers
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
