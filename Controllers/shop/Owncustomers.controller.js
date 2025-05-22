const OwnCustomer = require("../../Models/shop/Owncustomers");
const Shops = require("../../Models/shop/Shop");

const createOrUpdateOwnCustomer = async (req, res) => {
  try {
    const { name, addressProof, pincode, address, phoneNumber, orderHistory } =
      req.body;

    // Basic Validation
    if (
      !name ||
      !addressProof ||
      !pincode ||
      !address ||
      !phoneNumber ||
      !orderHistory ||
      !Array.isArray(orderHistory.items)
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Order Items
    for (const item of orderHistory.items) {
      if (
        !item.tyreid ||
        !item.invoiceUrl ||
        !item.size ||
        !item.quantity ||
        !item.vehicleNumber ||
        !item.customerPurchaseType
      ) {
        return res
          .status(400)
          .json({ message: "Invalid order item structure" });
      }
    }

    const currentOrderTotal = orderHistory.totalAmount || 0;
    const newOrder = {
      items: orderHistory.items,
      totalAmount: currentOrderTotal,
      orderDate: orderHistory.orderDate || new Date(),
    };

    // Check if customer exists
    let customer = await OwnCustomer.findOne({ name, phoneNumber });

    if (customer) {
      // Existing customer: update
      customer.orderHistory.push(newOrder);
      customer.totalamount += currentOrderTotal;

      await customer.save();

      return res.status(200).json({
        message: "Order added to existing customer",
        customer,
      });
    } else {
      // New customer: create
      const newCustomer = new OwnCustomer({
        name,
        addressProof,
        pincode,
        address,
        phoneNumber,
        orderHistory: [newOrder],
        totalAmount: currentOrderTotal,
      });

      await newCustomer.save();

      // Link customer to shop
      const { userId } = req.user;
      const shop = await Shops.findOne({ userId });

      if (!shop) {
        return res
          .status(404)
          .json({ message: "Shop not found for this user" });
      }

      shop.OwnCustomers.push(newCustomer._id);
      await shop.save();

      return res.status(201).json({
        message: "Customer created and linked to shop",
        customer: newCustomer,
      });
    }
  } catch (err) {
    console.error("Create/Update Customer Error:", err);
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
