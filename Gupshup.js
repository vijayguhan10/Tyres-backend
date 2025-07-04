const axios = require("axios");
const { URLSearchParams } = require("url");

const SOURCE_NUMBER = "15557940575"; // Your Gupshup WABA number
const DESTINATION_NUMBER = "918438434868"; // User's phone number

// Free text message (supports bold using * symbols and newlines with \n)
const messagePayload = {
  type: "text",
  text: "*Autom Consultancy Services*\n\n🚨 This is a professional auto message.\nPlease reply if you have any queries."
};

const encodedParams = new URLSearchParams();
encodedParams.set("channel", "whatsapp");
encodedParams.set("source", SOURCE_NUMBER);
encodedParams.set("destination", DESTINATION_NUMBER);
encodedParams.set("message", JSON.stringify(messagePayload));
encodedParams.set("src.name", "revozen"); // Your business name

const options = {
  method: "POST",
  url: "https://api.gupshup.io/sm/api/v1/msg", // Correct URL for free-form messages
  headers: {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    apikey: "qnnqh7w8kdkjntz2dze34xbjw1vmgijk", // Your API key
  },
  data: encodedParams.toString(),
};

axios
  .request(options)
  .then((response) => {
    console.log("Gupshup API Response:", response.status, response.statusText);
    console.log("Message sent successfully:", response.data);
  })
  .catch((error) => {
    console.error("Error sending message:", error.response?.data || error.message);
  });
