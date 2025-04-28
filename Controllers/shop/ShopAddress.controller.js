const Address = require("../../Models/Address");

const createAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const newAddress = new Address({
      userId: req.user.userId,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("userId", "name email");
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (address.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    address.street = req.body.street || address.street;
    address.city = req.body.city || address.city;
    address.state = req.body.state || address.state;
    address.postalCode = req.body.postalCode || address.postalCode;
    address.country = req.body.country || address.country;

    const updatedAddress = await address.save();
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (address.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    address.deleted = true;
    await address.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
