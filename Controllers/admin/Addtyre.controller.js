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
const AddNewStocks = async (req, res) => {
  try {
    const { stock, tyreid } = req.body;
    console.log(stock,tyreid)

    if (!tyreid || !stock) {
      return res.status(400).json({ 
        message: "Tyre ID and stock details are required" 
      });
    }

    const existingTyre = await Tyre.findById(tyreid);

    if (!existingTyre) {
      return res.status(404).json({
        message: "No tyre found with the specified ID"
      });
    }

    if (!Array.isArray(stock)) {
      return res.status(400).json({
        message: "Stock must be an array of size, quantity and price objects"
      });
    }

    for (const item of stock) {
      const { size, quantity, price } = item;
      
      const existingSize = existingTyre.stock.find(s => s.size === size);
      
      if (existingSize) {
        const newQuantity = Number(quantity) - existingSize.quantity;
        existingSize.quantity += newQuantity;
        if (price) {
          existingSize.price = Number(price);
        }
      } else {
        existingTyre.stock.push({
          size,
          quantity: Number(quantity),
          price: Number(price)
        });
      }
    }

    await existingTyre.save();

    res.status(200).json({
      message: "Stock updated successfully",
      tyre: existingTyre
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
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



module.exports = {
  createTyre,
  getAllTyres,
  getTyreById,
  AddNewStocks,
  updateTyre,
  deleteTyre,

};
