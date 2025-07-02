const axios = require("axios");
const { URLSearchParams } = require("url");

// 🔁 Dynamic values for your template placeholders
const verificationCode = "835482";               // → replaces {{1}}
const transferDetails = "₹000 to Rahul";       // → replaces {{2}}
const supportContact = "support@revozen.com";    // → replaces {{3}}

// ✅ Gupshup sender and recipient numbers (include country code)
const SOURCE_NUMBER = "15557989875";             // Your Gupshup-approved number
const DESTINATION_NUMBER = "918438434868";       // Customer's WhatsApp number

// 🔧 Template message payload
const templatePayload = {
  type: "hsm",
  elementName: "revozenverification",            // ✅ Approved template name
  language: {
    code: "en",                                   // Language of the template
  },
  params: [verificationCode, transferDetails, supportContact] // Dynamic values
};

// 🔐 Encode request parameters
const encodedParams = new URLSearchParams();
encodedParams.set("channel", "whatsapp");
encodedParams.set("source", SOURCE_NUMBER);
encodedParams.set("destination", DESTINATION_NUMBER);
encodedParams.set("message", JSON.stringify(templatePayload));
encodedParams.set("src.name", "revozen"); // Replace with your registered Gupshup app name

// 🧾 API request options
const options = {
  method: "POST",
  url: "https://api.gupshup.io/wa/api/v1/msg",
  headers: {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    apikey: "sk_0a6899d7e89d4c4f95866d6b9ef0fc17", // 🔐 Replace with your Gupshup API key
  },
  data: encodedParams.toString(),
};

// 🚀 Send the WhatsApp template message
axios
  .request(options)
  .then((response) => {
    console.log("🔔 Gupshup API Response:", response.status, response.statusText);
    console.log("✅ Message sent successfully:", response.data);
  })
  .catch((error) => {
    console.error("❌ Error sending message:", error.response?.data || error.message);
  });
