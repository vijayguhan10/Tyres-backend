const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Inventory = require("../Models/admin/Addtyre"); // Your Mongoose Model

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Query Gemini to extract filter or pipeline first
async function extractQuery(question) {
  const fixedSchema = {
    brand: "String",
    model: "String",
    vehicleType: "String",
    stock: [{ size: "String", quantity: "Number", price: "Number" }],
    createdAt: "Date",
    updatedAt: "Date",
  };

  // Provide a small sample
  const sampleData = await Inventory.find({}).limit(3);

  const prompt = `
You are a tyre inventory API.
Here is your collection's schema:
${JSON.stringify(fixedSchema, null, 2)}

Here is some sample data from this collection:
${JSON.stringify(sampleData, null, 2)}

Question: ${question}

Instructions:
- If the question involves retrieving documents, respond with:
  { "intent": "<intent_name>", "filter": { "<field>": "<value>" } }
- If it involves an aggregation, respond with:
  { "intent": "<intent_name>", "aggregation_pipeline": [ … ] }
- Provide only the JSON and nothing else.
`;

  console.log("PROMPT FOR GEMINI (Extract Query):\n", prompt);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash-002",
  });
  const result = await model.generateContent([prompt]);
  const rawResponse = result.response.text();

  console.log("RAW GEMINI API (Extract Query) RESPONSE:\n", rawResponse.trim());

  const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : rawResponse.trim();

  let parsed = {};

  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error("Error parsing Gemini's response as JSON", err);
  }

  return parsed;
}

// 2. Query your Database
async function fetchFromDB(parsed) {
  let documents;

  if (parsed?.filter) {
    documents = await Inventory.find(parsed.filter);
  } else if (parsed?.aggregation_pipeline) {
    documents = await Inventory.aggregate(parsed.aggregation_pipeline);
  } else {
    documents = []; // fallback if nothing
  }

  return documents;
}

// 3. Generate human-readable summary
async function generateReadableSentence(documents, question) {
  const prompt = `
Question: ${question}

Here is the raw data you retrieved from your database:
${JSON.stringify(documents, null, 2)}

Provide a clear, human-readable sentence summarizing this information.
`;

  console.log("PROMPT FOR HUMAN-READABLE SUMMARY:\n", prompt);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash-002",
  });
  const result = await model.generateContent([prompt]);
  const rawResponse = result.response.text();

  console.log("RAW GEMINI API (Summary) RESPONSE:\n", rawResponse.trim());

  return rawResponse.trim();
}

async function handleQuery(req, res) {
  try {
    const question = req.body?.question;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    // 1. Extract filter or pipeline first
    const parsed = await extractQuery(question);
    // 2. Query your DB with parsed criteria
    const documents = await fetchFromDB(parsed);
    // 3. Send back human-readable summary
    const summary = await generateReadableSentence(documents, question);
    res.json({ summary, documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}

module.exports = { handleQuery };
