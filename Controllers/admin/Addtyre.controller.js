const mongoose = require("mongoose");
const Tyre = require("../../Models/admin/Addtyre");

// POST /api/tyres
const createTyre = async (req, res) => {
  try {
    const {
      brand,
      model,
      type,
      vehicleType,
      loadIndex,
      speedRating,
      price,
      description,
      images,
      warranty,
      stock,
    } = req.body;

    const newTyre = new Tyre({
      brand,
      model,
      type,
      vehicleType,
      loadIndex,
      speedRating,
      price,
      description,
      images,
      warranty,
      stock,
    });

    const tyre = await newTyre.save();
    res.status(201).json(tyre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/tyres
const getAllTyres = async (req, res) => {
  try {
    const tyres = await Tyre.find();
    res.status(200).json(tyres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tyres/:id
const getTyreById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tyre ID" });
  }

  try {
    const tyre = await Tyre.findById(id);
    if (!tyre) {
      return res.status(404).json({ message: "Tyre not found" });
    }
    res.status(200).json(tyre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tyres/:id
const updateTyre = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tyre ID" });
  }

  try {
    const tyre = await Tyre.findByIdAndUpdate(id, req.body, { new: true });
    if (!tyre) {
      return res.status(404).json({ message: "Tyre not found" });
    }
    res.status(200).json(tyre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/tyres/:id
const deleteTyre = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tyre ID" });
  }

  try {
    const tyre = await Tyre.findById(id);

    if (!tyre) {
      return res.status(404).json({ message: "Tyre not found" });
    }

    tyre.deleted = true;
    await tyre.save();

    res.status(200).json({ message: "Tyre marked as deleted", tyre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment stock quantity for a specific size
const incrementStockQuantity = async (req, res) => {
  const { id } = req.params;
  const { size, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tyre ID" });
  }

  if (!size || !quantity) {
    return res.status(400).json({ 
      message: "Size and quantity are required" 
    });
  }

  try {
    const tyre = await Tyre.findById(id);
    
    if (!tyre) {
      return res.status(404).json({ message: "Tyre not found" });
    }

    // Find the stock item with the matching size
    const stockItem = tyre.stock.find(item => item.size === size);
    
    if (!stockItem) {
      return res.status(404).json({ message: `Size ${size} not found in stock` });
    }

    // Increment quantity
    stockItem.quantity += Number(quantity);
    await tyre.save();
    
    res.status(200).json({ 
      message: `Stock incremented successfully by ${quantity}`, 
      tyre 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decrement stock quantity for a specific size
const decrementStockQuantity = async (req, res) => {
  const { id } = req.params;
  const { size, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tyre ID" });
  }

  if (!size || !quantity) {
    return res.status(400).json({ 
      message: "Size and quantity are required" 
    });
  }

  try {
    const tyre = await Tyre.findById(id);
    
    if (!tyre) {
      return res.status(404).json({ message: "Tyre not found" });
    }

    // Find the stock item with the matching size
    const stockItem = tyre.stock.find(item => item.size === size);
    
    if (!stockItem) {
      return res.status(404).json({ message: `Size ${size} not found in stock` });
    }

    // Check if there's enough stock to decrement
    if (stockItem.quantity < quantity) {
      return res.status(400).json({ 
        message: `Not enough stock. Current: ${stockItem.quantity}, Requested: ${quantity}` 
      });
    }

    // Decrement quantity
    stockItem.quantity -= Number(quantity);
    await tyre.save();
    
    res.status(200).json({ 
      message: `Stock decremented successfully by ${quantity}`, 
      tyre 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new size to stock with quantity
const addNewSizeToStock = async (req, res) => {
  const { id } = req.params;
  const { size, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tyre ID" });
  }

  if (!size || !quantity) {
    return res.status(400).json({ message: "Size and quantity are required" });
  }

  try {
    const tyre = await Tyre.findById(id);
    
    if (!tyre) {
      return res.status(404).json({ message: "Tyre not found" });
    }

    // Check if size already exists
    const existingSize = tyre.stock.find(item => item.size === size);
    
    if (existingSize) {
      return res.status(400).json({ 
        message: `Size ${size} already exists in stock. Use increment operation instead.` 
      });
    }

    // Add new size to stock
    tyre.stock.push({ size, quantity: Number(quantity) });
    await tyre.save();
    
    res.status(200).json({ 
      message: "New size added to stock successfully", 
      tyre 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTyre,
  getAllTyres,
  getTyreById,
  updateTyre,
  deleteTyre,
  incrementStockQuantity,
  decrementStockQuantity,
  addNewSizeToStock
};
