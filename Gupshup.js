const axios = require("axios");
const { URLSearchParams } = require("url");

const SOURCE_NUMBER = "15557940575";
const DESTINATION_NUMBER = "918438434868";

const messagePayload = {
  type: "template",
  template: {
    name: "sample1", // Your template name in Gupshup
    language: {
      policy: "deterministic",
      code: "en_US"
    },
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: "123456" },   // Example OTP
          { type: "text", text: "$12.34" }    // Example amount
        ]
      }
    ]
  }
};

const encodedParams = new URLSearchParams();
encodedParams.set("channel", "whatsapp");
encodedParams.set("source", SOURCE_NUMBER);
encodedParams.set("destination", DESTINATION_NUMBER);
encodedParams.set("message", JSON.stringify(messagePayload));
encodedParams.set("src.name", "revozen");

const options = {
  method: "POST",
  url: "https://api.gupshup.io/sm/api/v1/msg",
  headers: {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    apikey: "qnnqh7w8kdkjntz2dze34xbjw1vmgijk"
  },
  data: encodedParams.toString(),
};

axios
  .request(options)
  .then((response) => {
    console.log(response.status, response.statusText);
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error.response?.data || error.message);
  });
