// server/controller/inventoryController.js
const Inventory = require("../Models/admin/Addtyre");
const { extractQuery, generateReadableSentence } = require("../Utils/Gpt");

const getInventory = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
     
        return res.status(400).json({ error: "Question is required" });
    }
    // Provide sample schema and data
    const sampleData = await Inventory.find().limit(5).lean();
    const schema = {
      brand: "String",
      model: "String",
      vehicleType: "String",
      stock: "Number",
      createdAt: "Date",
      updatedAt: "Date",
    };

    // 1️⃣ extract intent and filter from question
    const { intent, filter } = await extractQuery(question, schema, sampleData);

    // 2️⃣ Query the collection
    let rawData;
    if (intent === "inventory_count") {
      rawData = await Inventory.countDocuments(filter);
    } else if (intent === "inventory_fetch") {
      rawData = await Inventory.find(filter).lean();
    }

    // 3️⃣ Generate human-readable sentence
    const sentence = await generateReadableSentence(rawData, question);

    res.json({ sentence });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
};

module.exports = { getInventory };
